namespace Ranger.Spa {
    public class SpaFallbackOptions {
        public SpaFallbackOptions () {
            this.RewritePath = "/";
        }
        public string RewritePath { get; set; }
    }
}