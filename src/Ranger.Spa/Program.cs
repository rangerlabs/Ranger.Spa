using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Ranger.Logging;

namespace Ranger.Spa {
    public class Program {
        public static void Main (string[] args) {
            var config = new ConfigurationBuilder ()
                .SetBasePath (Directory.GetCurrentDirectory ())
                .AddJsonFile ("appsettings.json", optional : false, reloadOnChange : true)
                .AddJsonFile ($"appsettings.{Environment.GetEnvironmentVariable ("ASPNETCORE_ENVIRONMENT")}.json", optional : false, reloadOnChange : true)
                .AddEnvironmentVariables ()
                .Build ();

            BuildHost (config["serverBindingUrl"], args).Run ();
        }
        public static IWebHost BuildHost (string serverBindingUrl, string[] args) =>
            WebHost.CreateDefaultBuilder (args)
            .UseContentRoot (Directory.GetCurrentDirectory ())
            .UseUrls (serverBindingUrl)
            .UseStartup<Startup> ()
            .UseLogging ()
            .Build ();
    }
}