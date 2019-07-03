using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Ranger.Spa;

namespace Ranger.Spa {
    public class Startup {
        public IHostingEnvironment CurrentEnvironment { get; protected set; }
        public IConfiguration configuration { get; }

        public Startup (IConfiguration configuration) {
            this.configuration = configuration;
        }
        public void ConfigureServices (IServiceCollection services) {
            services.AddMvc ();
        }

        public void Configure (IApplicationBuilder app, IHostingEnvironment env) {
            if (env.IsDevelopment ()) {
                var hmrEnabled = false;
                if (Boolean.TryParse (configuration["hmrEnabled"], out hmrEnabled) && hmrEnabled) {
                    app.UseWebpackDevMiddleware (new WebpackDevMiddlewareOptions {
                        HotModuleReplacement = true,
                            ConfigFile = System.IO.Path.Combine (configuration["webClientPath"], "webpack.dev.js")

                    });
                }

                app.UseDeveloperExceptionPage ();
            }

            app.UseSpaFallback (new SpaFallbackOptions () {
                RewritePath = "/"
            });

            app.UseDefaultFiles ();

            var mimeTypeProvider = new FileExtensionContentTypeProvider ();
            app.UseStaticFiles (new StaticFileOptions {
                OnPrepareResponse = context => {
                    var headers = context.Context.Response.Headers;
                    var contentType = headers["Content-Type"];

                    if (contentType != "application/x-gzip" && !context.File.Name.EndsWith (".gz")) {
                        return;
                    }

                    var fileNameToTry = context.File.Name.Substring (0, context.File.Name.Length - 3);

                    if (mimeTypeProvider.TryGetContentType (fileNameToTry, out var mimeType)) {
                        headers.Add ("Content-Encoding", "gzip");
                        headers["Content-Type"] = mimeType;
                    }
                }
            });

            app.UseMvc ();
        }
    }
}