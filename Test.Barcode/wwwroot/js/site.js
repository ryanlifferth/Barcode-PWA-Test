$(document).ready(
    function () {

        // mobile menu slide from the left
        // taken from https://stackoverflow.com/questions/43930068/bootstrap-4-mobile-nav-bar-slide-from-left
        $('[data-toggle="slide-collapse"]').on('click', function () {
            $navMenuCont = $($(this).data('target'));
            $navMenuCont.animate({ 'width': 'toggle' }, 280).toggleClass('in');
            //$navMenuCont.toggle();
        });

        // Uses jQuery mobile lib
        $(".navbar-collapse").on("swiperight", function () {
            $("button.navbar-toggler").click();
        });

        $(document).click(function (event) {
            var clickover = $(event.target);

            // Don't dismiss if the user clicks on the menu or menu button
            if (keepMenuOpen(clickover)) return;

            var _opened = $(".navbar-collapse").hasClass("navbar-collapse in");
            if (_opened === true) {
                $("button.navbar-toggler").click();
            }
        });

        var keepMenuOpen = function (clickover) {
            var keepOpen = false;

            if (clickover.hasClass("navbar-toggler") ||
                clickover.parents(".navbar-toggler").length > 0 ||
                clickover.hasClass("navbar-collapse") ||
                clickover.parents(".navbar-collapse").length > 0) {
                keepOpen = true;
            }

            return keepOpen;
        };


        ///
        /// Custom event handler for swipeup and swipedown
        ///
        var supportTouch = $.support.touch,
            scrollEvent = "touchmove scroll",
            touchStartEvent = supportTouch ? "touchstart" : "mousedown",
            touchStopEvent = supportTouch ? "touchend" : "mouseup",
            touchMoveEvent = supportTouch ? "touchmove" : "mousemove";
        $.event.special.swipeupdown = {
            setup: function () {
                var thisObject = this;
                var $this = $(thisObject);
                $this.bind(touchStartEvent, function (event) {
                    var data = event.originalEvent.touches ?
                        event.originalEvent.touches[0] :
                        event,
                        start = {
                            time: (new Date).getTime(),
                            coords: [data.pageX, data.pageY],
                            origin: $(event.target)
                        },
                        stop;

                    function moveHandler(event) {
                        if (!start) {
                            return;
                        }
                        var data = event.originalEvent.touches ?
                            event.originalEvent.touches[0] :
                            event;
                        stop = {
                            time: (new Date).getTime(),
                            coords: [data.pageX, data.pageY]
                        };

                        // prevent scrolling
                        if (Math.abs(start.coords[1] - stop.coords[1]) > 10) {
                            event.preventDefault();
                        }
                    }
                    $this
                        .bind(touchMoveEvent, moveHandler)
                        .one(touchStopEvent, function (event) {
                            $this.unbind(touchMoveEvent, moveHandler);
                            if (start && stop) {
                                if (stop.time - start.time < 1000 &&
                                    Math.abs(start.coords[1] - stop.coords[1]) > 30 &&
                                    Math.abs(start.coords[0] - stop.coords[0]) < 75) {
                                    start.origin
                                        .trigger("swipeupdown")
                                        .trigger(start.coords[1] > stop.coords[1] ? "swipeup" : "swipedown");
                                }
                            }
                            start = stop = undefined;
                        });
                });
            }
        };
        $.each({
            swipedown: "swipeupdown",
            swipeup: "swipeupdown"
        }, function (event, sourceEvent) {
            $.event.special[event] = {
                setup: function () {
                    $(this).bind(sourceEvent, $.noop);
                }
            };
        });

        
    }
);