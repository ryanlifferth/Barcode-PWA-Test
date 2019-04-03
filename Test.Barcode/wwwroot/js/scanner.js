$(function () {

    var _scannerIsRunning = false;
    var _scannedDocCount = 0;
    var _scannedNumbers = new Array();

    function startScanner() {

        // Create the QuaggaJS config object for the live stream
        var liveStreamConfig = {
            inputStream: {
                type: "LiveStream",
                target: document.querySelector('.scan-viewport'),
                constraints: {
                    width: { min: 480 },
                    height: { min: 640 },
                    aspectRatio: { min: 1, max: 2 },
                    facingMode: "environment" // or "user" for the front camera
                }
            },
            locator: {
                patchSize: "medium",
                halfSample: true
            },
            numOfWorkers: navigator.hardwareConcurrency ? navigator.hardwareConcurrency : 4,
            frequency: 10,
            decoder: {
                "readers": [
                    { "format": "ean_reader", "config": { } }
                ]
            },
            locate: true
        };

        // The fallback to the file API requires a different inputStream option.  
        var fileConfig = $.extend(
            {},
            liveStreamConfig,
            {
                inputStream: {
                    size: 800
                }
            }
        );

        // Start the live stream scanner when the modal opens
        Quagga.init(
            liveStreamConfig,
            function (err) {
                if (err) {
                    $('#livestream_scanner .modal-body .error').html('<div class="alert alert-danger"><strong><i class="fa fa-exclamation-triangle"></i> ' + err.name + '</strong>: ' + err.message + '</div>');
                    Quagga.stop();
                    _scannerIsRunning = false;
                    return;
                }
                Quagga.start();
                _scannerIsRunning = true;
            }
        );

        // Make sure, QuaggaJS draws frames an lines around possible barcodes on the live stream
        Quagga.onProcessed(function (result) {
            var drawingCtx = Quagga.canvas.ctx.overlay,
                drawingCanvas = Quagga.canvas.dom.overlay;

            if (result) {
                if (result.boxes) {
                    drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
                    result.boxes.filter(function (box) {
                        return box !== result.box;
                    }).forEach(function (box) {
                        Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: "green", lineWidth: 2 });
                    });
                }

                if (result.box) {
                    Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: "#00F", lineWidth: 2 });
                }

                if (result.codeResult && result.codeResult.code) {
                    Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 });
                }
            }
        });

        // Once a barcode had been read successfully, stop quagga and
        // close the modal after a second to let the user notice where
        // the barcode had actually been found.
        Quagga.onDetected(function (result) {
            if (result.codeResult.code && !_scannedNumbers.includes(result.codeResult.code)) {
                //$('#scanner_input').val(result.codeResult.code);
                // Do something with the result.....don't stop
                _scannedNumbers.push(result.codeResult.code);
                $('.scan-results').prepend('<span class="result">' + result.codeResult.code + '<span class="delete far fa-trash-alt"></span></span>');

                _scannedDocCount++;
                var docLabelPlurality = _scannedDocCount === 1 ? "document" : "documents";
                $(".scan-count").text(_scannedDocCount);
                $(".docs-plurality").text(docLabelPlurality);

                if (_scannedDocCount > 0) {
                    $(".control-buttons .next").show();
                }

                // TODO:  Make sure there isn't a duplicate


                var drawingCtx = Quagga.canvas.ctx.overlay,
                    drawingCanvas = Quagga.canvas.dom.overlay;
                drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));

                Quagga.stop();
                _scannerIsRunning = false;
                setTimeout(function () { startScanner(); }, 500);
            }
        });
    }


    // start when the page loads
    startScanner();

    //$(".expand-toggle").on("swipeup", function () {
    $(".scan-controls").on("swipeup", function () {
        //$(this).parent().addClass("expanded-controls");  // use this if event is attached to .expand-toggle
        $(this).addClass("expanded-controls");  
    });

    $(".scan-controls").on("swipedown", function () {
        //$(this).parent().removeClass("expanded-controls");  // use this if event is attached to .expand-toggle
        $(this).removeClass("expanded-controls");
    });



    $('#newScan').on('click', function () {
        startScanner();
    });

    $(".test").on('click', function () {

        for (var i = 0; i <= 3; i++) {
            var scannedResult = '3813700408';
            $('.scan-results').prepend('<span class="result">' + scannedResult + '' + i + '<span class="delete far fa-trash-alt"></span></span>');

            _scannedDocCount++;
            var docLabelPlurality = _scannedDocCount === 1 ? "document" : "documents";
            $(".scan-count").text(_scannedDocCount);
            $(".docs-plurality").text(docLabelPlurality);

            if (_scannedDocCount > 0) {
                $(".control-buttons .next").show();
            }
        }
    });



});