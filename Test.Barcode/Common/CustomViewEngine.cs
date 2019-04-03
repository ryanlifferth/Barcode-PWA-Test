using Microsoft.AspNetCore.Mvc.Razor;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Test.Barcode.Common
{
    public class CustomViewEngine : IViewLocationExpander
    {

        private static string[] NewPartialViewFormats = new[]
        {
            "~/Views/{1}/PartialViews/{0}.cshtml",
            "~/Views/Shared/PartialViews/{0}.cshtml"
        };

        public IEnumerable<string> ExpandViewLocations(ViewLocationExpanderContext context, IEnumerable<string> viewLocations)
        {
            return viewLocations.Union(NewPartialViewFormats);
        }

        public void PopulateValues(ViewLocationExpanderContext context)
        {
        }
    }
}
