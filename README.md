# Test PWA - Barcode Reader

This is a proof of concept application to check the feasibility of creating a Progressive
Web Application (PWA) that scans barcodes and QR codes using the devices native
camera options (iPhone or Android).

This application is set up to be a PWA, with required manifest files and service
worker JavaScript.  The < meta > header values, icons (wwwroot/images/icons), 
and manifest.json were added manually.  The service worker items were added 
through the asp.net core libs (*see Startup.cs line 27 - services.AddProgressiveWebApp()*).

## Prerequirements

* .NET Core SDK & Editor (Visual Studio or Visual Studio Code)
* JS/CSS libraries:  All libraries added using Visual Studio libman (Library Manager)
  * Bootstrap
    * JQuery (have to use min, but not slim to get QuaggaJS to work)
  * SASS CSS
  * FontAwesome (pro)
  * JQuery mobile UI (added manually to project with just swipe features added)
  * webrtc-adapter:  Used for camera shims
  * QuaggaJS:  Barcode reader JS library (not the best, but works for the POC).  GitHub and examples: https://serratus.github.io/quaggaJS/examples/file_input.html
* Nuget dependencies
  * WebEssentials.AspNetCore.PWA

## How To Run

* Open solution in Visual Studio / Visual Studio Code
* Run the application

## Notes

When added to the home screen (PWA), the application works good on Android devices.  The 
application also works well on Android and iOS browsers.  

However, when added to the home screen (PWA) on iOS, the camera does not work
as expected.  This is a known issue and a bug with iOS 12.2 (current version as 
well as all previous versions).  For more information, see https://medium.com/@firt/whats-new-on-ios-12-2-for-progressive-web-apps-75c348f8e945.