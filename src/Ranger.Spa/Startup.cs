using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Ranger.Spa
{
    public class Startup
    {
        private readonly IWebHostEnvironment Environment;
        private readonly IConfiguration configuration;

        public Startup(IWebHostEnvironment environment, IConfiguration configuration)
        {
            this.Environment = environment;
            this.configuration = configuration;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();
        }

        public void Configure(IApplicationBuilder app)
        {
            if (Environment.EnvironmentName == Environments.Development)
            {
                var hmrEnabled = false;
                if (Boolean.TryParse(configuration["hmrEnabled"], out hmrEnabled) && hmrEnabled)
                {
                    // app.UseWebpackDevMiddleware (new WebpackDevMiddlewareOptions {
                    // HotModuleReplacement = true,
                    // ConfigFile = System.IO.Path.Combine (configuration["webClientPath"], "webpack.dev.js")

                    // });
                }

                app.UseDeveloperExceptionPage();
            }

            app.UseSpaFallback(new SpaFallbackOptions()
            {
                RewritePath = "/"
            });

            app.UseDefaultFiles();

            var mimeTypeProvider = new FileExtensionContentTypeProvider();
            mimeTypeProvider.Mappings[".webmanifest"] = "application/manifest+json";

            app.UseStaticFiles(new StaticFileOptions
            {
                OnPrepareResponse = context =>
                {
                    var headers = context.Context.Response.Headers;
                    context.Context.Response.Cookies.Append("spa-version", configuration["DOCKER_IMAGE_TAG"]);
                    var contentType = headers["Content-Type"];

                    if (contentType != "application/x-gzip" && !context.File.Name.EndsWith(".gz"))
                    {
                        return;
                    }

                    var fileNameToTry = context.File.Name.Substring(0, context.File.Name.Length - 3);

                    if (mimeTypeProvider.TryGetContentType(fileNameToTry, out var mimeType))
                    {
                        headers.Add("Content-Encoding", "gzip");
                        headers["Content-Type"] = mimeType;
                    }
                }
            });

            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapDefaultControllerRoute();
            });
        }
    }
}