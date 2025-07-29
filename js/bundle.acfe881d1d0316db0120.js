( () => {
    var e = {
        834: () => {
            document.addEventListener("DOMContentLoaded", (function() {
                var e = {
                    canvas: document.getElementById("picker"),
                    load: function() {
                        e.context = e.canvas.getContext("2d", {
                            willReadFrequently: !0
                        }),
                        e.updateDimensions(),
                        e.wheel.image.onload = function() {
                            e.wheel.draw(),
                            e.calculate({
                                x: e.size - e.markers.outerRadius - 5,
                                y: e.center
                            }, 0)
                        }
                        ,
                        e.wheel.image.src = "../images/color-wheel.webp",
                        document.querySelector("#picker").addEventListener("mousedown", e.drag.down),
                        document.querySelector("#picker").addEventListener("touchstart", e.drag.down, {
                            passive: !1
                        }),
                        document.body.addEventListener("mouseup", e.drag.up),
                        document.body.addEventListener("touchend", e.drag.up, {
                            passive: !0
                        }),
                        document.body.addEventListener("mousemove", e.drag.move),
                        document.body.addEventListener("touchmove", e.drag.move, {
                            passive: !1
                        }),
                        window.addEventListener("resize", e.reinitialize)
                    },
                    reinitialize: function() {
                        e.updateDimensions(),
                        e.clearCanvas(),
                        e.wheel.draw(),
                        e.markers.draw(),
                        e.calculate({
                            x: e.markers.list[e.markers.selected].x,
                            y: e.markers.list[e.markers.selected].y
                        }, e.markers.selected)
                    },
                    updateDimensions: function() {
                        var t = e.canvas.parentElement.clientWidth;
                        e.size = t,
                        e.center = e.size / 2,
                        e.wheel.size = e.size - e.markers.outerSize,
                        e.wheel.radius = e.wheel.size / 2,
                        e.markers.outerRadius = e.markers.outerSize / 2,
                        e.markers.innerRadius = e.markers.innerSize / 2,
                        e.canvas.width = e.size,
                        e.canvas.height = e.size,
                        e.markers.list.forEach((function(t) {
                            t.x = Math.min(Math.max(t.x, e.markers.outerRadius), e.size - e.markers.outerRadius),
                            t.y = Math.min(Math.max(t.y, e.markers.outerRadius), e.size - e.markers.outerRadius)
                        }
                        )),
                        e.clearCanvas(),
                        e.wheel.draw(),
                        e.markers.draw()
                    },
                    clearCanvas: function() {
                        e.context.clearRect(0, 0, e.canvas.width, e.canvas.height)
                    },
                    wheel: {
                        size: 300,
                        image: new Image,
                        draw: function() {
                            e.context.drawImage(e.wheel.image, e.markers.outerRadius, e.markers.outerRadius, e.wheel.size, e.wheel.size)
                        }
                    },
                    markers: {
                        outerSize: 30,
                        innerSize: 22.5,
                        list: [],
                        selected: 0,
                        draw: function() {
                            for (var t = e.markers.list.length - 1; t >= 0; t--) {
                                var r = e.markers.list[t]
                                  , n = Math.atan((r.y - e.center) / (r.x - e.center))
                                  , s = r.x - e.center < 0
                                  , i = 3 * Math.PI / 2 + n
                                  , a = i - Math.PI;
                                e.markers.drawContainer(r, e.markers.outerRadius, i, a, s)
                            }
                            var o = void 0;
                            for (t = e.markers.list.length - 1; t >= 0; t--) {
                                var l, d;
                                if (e.markers.selected != t)
                                    e.markers.drawCircle((null === (l = e.colors.list[t]) || void 0 === l ? void 0 : l.str) || "#000", e.markers.list[t], e.markers.innerRadius);
                                else
                                    (o = e.markers.list[t]).color = (null === (d = e.colors.list[t]) || void 0 === d ? void 0 : d.str) || "#000"
                            }
                            o && (e.markers.drawCircle("#FFF", o, e.markers.outerRadius),
                            e.markers.drawCircle(o.color, o, e.markers.innerRadius))
                        },
                        drawContainer: function(t, r, n, s, i) {
                            e.context.fillStyle = "rgba(255, 255, 255, 0.5)",
                            e.context.beginPath(),
                            e.context.moveTo(e.center, e.center),
                            e.context.arc(t.x, t.y, r, n, s, i),
                            e.context.lineTo(e.center, e.center),
                            e.context.fill(),
                            e.context.closePath()
                        },
                        drawCircle: function(t, r, n) {
                            e.context.fillStyle = t,
                            e.context.beginPath(),
                            e.context.arc(r.x, r.y, n, 0, 2 * Math.PI),
                            e.context.fill(),
                            e.context.closePath()
                        }
                    },
                    drag: {
                        markerDragging: -1,
                        down: function(t) {
                            t.preventDefault();
                            var r = t.touches ? t.touches[0] : t
                              , n = e.canvas.getBoundingClientRect()
                              , s = e.canvas.width / n.width
                              , i = e.canvas.height / n.height
                              , a = (r.clientX - n.left) * s
                              , o = (r.clientY - n.top) * i;
                            if (e.drag.intersects(a, o, e.markers.list[e.markers.selected]))
                                e.drag.markerDragging = e.markers.selected;
                            else
                                for (var l = e.markers.list.length - 1; l >= 0; l--)
                                    if (e.drag.intersects(a, o, e.markers.list[l])) {
                                        var d, c;
                                        e.markers.selected = l,
                                        null === (d = document.querySelector(".samples .col.selected")) || void 0 === d || d.classList.remove("selected"),
                                        null === (c = document.querySelector('.samples .col[data-sample="'.concat(l, '"]'))) || void 0 === c || c.classList.add("selected"),
                                        e.drag.markerDragging = l;
                                        break
                                    }
                            e.drag.move(t)
                        },
                        up: function() {
                            e.drag.markerDragging = -1
                        },
                        move: function(t) {
                            if (-1 != e.drag.markerDragging) {
                                t.preventDefault();
                                var r = t.touches ? t.touches[0] : t
                                  , n = e.canvas.getBoundingClientRect()
                                  , s = e.canvas.width / n.width
                                  , i = e.canvas.height / n.height
                                  , a = (r.clientX - n.left) * s
                                  , o = (r.clientY - n.top) * i;
                                e.calculate({
                                    x: Math.floor(a),
                                    y: Math.floor(o)
                                }, e.drag.markerDragging)
                            }
                        },
                        intersects: function(t, r, n) {
                            return t >= n.x - e.markers.outerRadius && t <= n.x + e.markers.outerRadius && r >= n.y - e.markers.outerRadius && r <= n.y + e.markers.outerRadius
                        }
                    },
                    calculate: function(t, r) {
                        var n;
                        if (e.clearCanvas(),
                        e.wheel.draw(),
                        255 != e.context.getImageData(t.x, t.y, 1, 1).data[3]) {
                            var s = Math.sqrt(Math.pow(t.x - e.center, 2) + Math.pow(t.y - e.center, 2))
                              , i = e.center - e.markers.outerRadius - 1 - s;
                            t = e.calc.extend(t, i)
                        }
                        if (Math.sqrt(Math.pow(t.x - e.center, 2) + Math.pow(t.y - e.center, 2)) > e.wheel.radius) {
                            var a = Math.atan2(t.y - e.center, t.x - e.center);
                            t.x = e.center + e.wheel.radius * Math.cos(a),
                            t.y = e.center + e.wheel.radius * Math.sin(a)
                        }
                        switch (null === (n = document.querySelector(".rules li.active")) || void 0 === n ? void 0 : n.dataset.type) {
                        case "1":
                            e.points.analogous(t, r),
                            e.colors.analogous();
                            break;
                        case "2":
                            e.points.monochromatic(t, r),
                            e.colors.monochromatic();
                            break;
                        case "3":
                            e.points.triad(t, r),
                            e.colors.triad();
                            break;
                        case "4":
                            e.points.complementary(t, r),
                            e.colors.complementary();
                            break;
                        case "5":
                            e.points.custom(t, r),
                            e.colors.custom(r)
                        }
                        for (r = 0; r < 5; r++) {
                            var o = document.querySelector('.samples > div[data-sample="'.concat(r, '"]'));
                            o && e.colors.list[r] && (o.querySelector(".hex").style.color = e.colors.list[r].str,
                            o.querySelector(".rgb.r").value = e.colors.list[r].r,
                            o.querySelector(".rgb.g").value = e.colors.list[r].g,
                            o.querySelector(".rgb.b").value = e.colors.list[r].b,
                            o.querySelector(".hex").value = "#" + e.calc.rgbToHex(e.colors.list[r].r, e.colors.list[r].g, e.colors.list[r].b))
                        }
                        e.markers.draw()
                    },
                    fromColor: function(t, r) {
                        var n = e.calc.rgbToRyb(t.r, t.g, t.b)
                          , s = e.calc.rgbToHsl(n.r, n.y, n.b);
                        s[2] < .5 && (s[2] = .5);
                        var i = e.wheel.radius * (1 - 2 * (s[2] - .5))
                          , a = 2 * Math.PI - e.calc.degToRad(360 * s[0])
                          , o = {
                            x: i * Math.cos(a),
                            y: i * Math.sin(a)
                        };
                        o.x += e.center,
                        o.y += e.center,
                        e.calculate(o, r)
                    },
                    points: {
                        analogous: function(t, r) {
                            e.markers.list = [];
                            var n = t;
                            1 == r ? n = e.calc.rotate(t, e.calc.degToRad(15)) : 2 == r ? n = e.calc.rotate(t, e.calc.degToRad(-15)) : 3 == r ? n = e.calc.rotate(t, e.calc.degToRad(30)) : 4 == r && (n = e.calc.rotate(t, e.calc.degToRad(-30))),
                            e.markers.list[0] = n,
                            e.markers.list[1] = e.calc.rotate(n, e.calc.degToRad(-15)),
                            e.markers.list[2] = e.calc.rotate(n, e.calc.degToRad(15)),
                            e.markers.list[3] = e.calc.rotate(n, e.calc.degToRad(-30)),
                            e.markers.list[4] = e.calc.rotate(n, e.calc.degToRad(30))
                        },
                        monochromatic: function(t, r) {
                            e.markers.list = [];
                            var n, s, i = e.wheel.radius / 190 * 58;
                            0 == r || 3 == r || 4 == r ? (n = t,
                            s = e.calc.extend(n, -i)) : 1 != r && 2 != r || (s = t,
                            n = e.calc.extend(s, i)),
                            e.markers.list[0] = n,
                            e.markers.list[1] = s,
                            e.markers.list[2] = s,
                            e.markers.list[3] = n,
                            e.markers.list[4] = n,
                            e.markers.list.forEach((function(t, r) {
                                if (255 != e.context.getImageData(t.x, t.y, 1, 1).data[3]) {
                                    var n = Math.sqrt(Math.pow(t.x - e.center, 2) + Math.pow(t.y - e.center, 2))
                                      , s = e.center - e.markers.outerRadius - 1 - n;
                                    t = e.calc.extend(t, s)
                                }
                                if (Math.sqrt(Math.pow(t.x - e.center, 2) + Math.pow(t.y - e.center, 2)) > e.wheel.radius) {
                                    var i = Math.atan2(t.y - e.center, t.x - e.center);
                                    t.x = e.center + e.wheel.radius * Math.cos(i),
                                    t.y = e.center + e.wheel.radius * Math.sin(i)
                                }
                                e.markers.list[r] = t
                            }
                            ))
                        },
                        triad: function(t, r) {
                            var n, s, i;
                            e.markers.list = [],
                            0 != r && 3 != r || (n = t,
                            s = e.calc.rotate(n, e.calc.degToRad(-120)),
                            i = e.calc.rotate(n, e.calc.degToRad(120))),
                            1 == r ? (n = e.calc.rotate(t, e.calc.degToRad(120)),
                            s = t,
                            i = e.calc.rotate(n, e.calc.degToRad(120))) : 2 != r && 4 != r || (n = e.calc.rotate(t, e.calc.degToRad(-120)),
                            s = e.calc.rotate(n, e.calc.degToRad(-120)),
                            i = t),
                            e.markers.list[0] = n,
                            e.markers.list[1] = s,
                            e.markers.list[2] = i,
                            e.markers.list[3] = n,
                            e.markers.list[4] = i
                        },
                        complementary: function(t, r) {
                            var n, s, i;
                            e.markers.list = [],
                            0 == r || 3 == r ? (n = t,
                            s = e.calc.extend(t, -e.markers.outerSize),
                            i = e.calc.rotate(n, Math.PI)) : 1 == r ? (n = e.calc.extend(t, e.markers.outerSize),
                            s = t,
                            i = e.calc.rotate(n, Math.PI)) : 2 != r && 4 != r || (n = e.calc.rotate(t, Math.PI),
                            s = e.calc.extend(n, -e.markers.outerRadius),
                            i = t),
                            e.markers.list[0] = n,
                            e.markers.list[1] = s,
                            e.markers.list[2] = i,
                            e.markers.list[3] = n,
                            e.markers.list[4] = i,
                            e.markers.list.forEach((function(t, r) {
                                if (255 != e.context.getImageData(t.x, t.y, 1, 1).data[3]) {
                                    var n = Math.sqrt(Math.pow(t.x - e.center, 2) + Math.pow(t.y - e.center, 2))
                                      , s = e.center - e.markers.outerRadius - 1 - n;
                                    t = e.calc.extend(t, s)
                                }
                                if (Math.sqrt(Math.pow(t.x - e.center, 2) + Math.pow(t.y - e.center, 2)) > e.wheel.radius) {
                                    var i = Math.atan2(t.y - e.center, t.x - e.center);
                                    t.x = e.center + e.wheel.radius * Math.cos(i),
                                    t.y = e.center + e.wheel.radius * Math.sin(i)
                                }
                                e.markers.list[r] = t
                            }
                            ))
                        },
                        custom: function(t, r) {
                            e.markers.list[r] = t
                        }
                    },
                    colors: {
                        list: [],
                        analogous: function() {
                            for (var t = 0; t < e.markers.list.length; t++) {
                                var r = e.context.getImageData(e.markers.list[t].x, e.markers.list[t].y, 1, 1).data;
                                if (1 == t || 2 == t) {
                                    var n = 255 * (1 - .91);
                                    r[0] -= n,
                                    r[0] = r[0] < 0 ? 0 : r[0],
                                    r[1] -= n,
                                    r[1] = r[1] < 0 ? 0 : r[1],
                                    r[2] -= n,
                                    r[2] = r[2] < 0 ? 0 : r[2]
                                }
                                e.colors.list[t] = {
                                    r: r[0],
                                    g: r[1],
                                    b: r[2],
                                    str: "rgb(" + r[0] + ", " + r[1] + ", " + r[2] + ")"
                                }
                            }
                        },
                        monochromatic: function() {
                            for (var t = 0; t < e.markers.list.length; t++) {
                                var r = e.context.getImageData(e.markers.list[t].x, e.markers.list[t].y, 1, 1).data;
                                if (255 == r[3]) {
                                    if (2 == t || 3 == t || 4 == t) {
                                        var n = 255 * (1 - (4 == t ? .8 : .5));
                                        r[0] -= n,
                                        r[0] = r[0] < 0 ? 0 : r[0],
                                        r[1] -= n,
                                        r[1] = r[1] < 0 ? 0 : r[1],
                                        r[2] -= n,
                                        r[2] = r[2] < 0 ? 0 : r[2]
                                    }
                                    e.colors.list[t] = {
                                        r: r[0],
                                        g: r[1],
                                        b: r[2],
                                        str: "rgb(" + r[0] + ", " + r[1] + ", " + r[2] + ")"
                                    }
                                }
                            }
                        },
                        triad: function() {
                            for (var t = 0; t < e.markers.list.length; t++) {
                                var r = e.context.getImageData(e.markers.list[t].x, e.markers.list[t].y, 1, 1).data;
                                if (255 == r[3]) {
                                    if (2 == t || 3 == t || 4 == t) {
                                        var n = 255 * (1 - (2 == t ? .8 : .7));
                                        r[0] -= n,
                                        r[0] = r[0] < 0 ? 0 : r[0],
                                        r[1] -= n,
                                        r[1] = r[1] < 0 ? 0 : r[1],
                                        r[2] -= n,
                                        r[2] = r[2] < 0 ? 0 : r[2]
                                    }
                                    e.colors.list[t] = {
                                        r: r[0],
                                        g: r[1],
                                        b: r[2],
                                        str: "rgb(" + r[0] + ", " + r[1] + ", " + r[2] + ")"
                                    }
                                }
                            }
                        },
                        complementary: function() {
                            for (var t = 0; t < e.markers.list.length; t++) {
                                var r = e.context.getImageData(e.markers.list[t].x, e.markers.list[t].y, 1, 1).data;
                                if (255 == r[3]) {
                                    if (2 == t || 3 == t) {
                                        var n = 255 * (1 - .7);
                                        r[0] -= n,
                                        r[0] = r[0] < 0 ? 0 : r[0],
                                        r[1] -= n,
                                        r[1] = r[1] < 0 ? 0 : r[1],
                                        r[2] -= n,
                                        r[2] = r[2] < 0 ? 0 : r[2]
                                    }
                                    e.colors.list[t] = {
                                        r: r[0],
                                        g: r[1],
                                        b: r[2],
                                        str: "rgb(" + r[0] + ", " + r[1] + ", " + r[2] + ")"
                                    }
                                }
                            }
                        },
                        custom: function(t) {
                            var r = e.context.getImageData(e.markers.list[t].x, e.markers.list[t].y, 1, 1).data;
                            255 == r[3] && (e.colors.list[t] = {
                                r: r[0],
                                g: r[1],
                                b: r[2],
                                str: "rgb(" + r[0] + ", " + r[1] + ", " + r[2] + ")"
                            })
                        }
                    },
                    calc: {
                        rotate: function(t, r) {
                            var n = Math.cos(r)
                              , s = Math.sin(r);
                            return {
                                x: n * (t.x - e.center) - s * (t.y - e.center) + e.center,
                                y: s * (t.x - e.center) + n * (t.y - e.center) + e.center
                            }
                        },
                        extend: function(t, r) {
                            var n = t.x - e.center
                              , s = t.y - e.center
                              , i = Math.sqrt(Math.pow(n, 2) + Math.pow(s, 2))
                              , a = Math.PI;
                            if (0 != n)
                                a = Math.atan(s / n) + (n >= 0 ? 0 : Math.PI);
                            return {
                                x: n = (i += r) * Math.cos(a) + e.center,
                                y: s = i * Math.sin(a) + e.center
                            }
                        },
                        degToRad: function(e) {
                            return e * Math.PI / 180
                        },
                        radToDeg: function(e) {
                            return 180 * e / Math.PI
                        },
                        hexToRgb: function(e) {
                            var t = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);
                            return t ? {
                                r: parseInt(t[1], 16),
                                g: parseInt(t[2], 16),
                                b: parseInt(t[3], 16)
                            } : null
                        },
                        rgbToHex: function(e, t, r) {
                            return ((1 << 24) + (e << 16) + (t << 8) + r).toString(16).slice(1).toUpperCase()
                        },
                        rgbToHsl: function(e, t, r) {
                            e /= 255,
                            t /= 255,
                            r /= 255;
                            var n, s, i = Math.max(e, t, r), a = Math.min(e, t, r), o = (i + a) / 2;
                            if (i == a)
                                n = s = 0;
                            else {
                                var l = i - a;
                                switch (s = o > .5 ? l / (2 - i - a) : l / (i + a),
                                i) {
                                case e:
                                    n = (t - r) / l + (t < r ? 6 : 0);
                                    break;
                                case t:
                                    n = (r - e) / l + 2;
                                    break;
                                case r:
                                    n = (e - t) / l + 4
                                }
                                n /= 6
                            }
                            return [n, s, o]
                        },
                        rgbToRyb: function(e, t, r) {
                            var n = Math.min(e, t, r);
                            e -= n,
                            t -= n,
                            r -= n;
                            var s = Math.max(e, t, r)
                              , i = Math.min(e, t);
                            e -= i,
                            t -= i,
                            r && t && (r /= 2,
                            t /= 2),
                            i += t,
                            r += t;
                            var a = Math.max(e, i, r);
                            if (a) {
                                var o = s / a;
                                e *= o,
                                i *= o,
                                r *= o
                            }
                            return {
                                r: e += n,
                                y: i += n,
                                b: r += n
                            }
                        }
                    }
                };
                e.load(),
                document.querySelectorAll(".rules li").forEach((function(t) {
                    t.addEventListener("click", (function() {
                        var t = document.querySelector(".rules li.active");
                        this !== t && (t.classList.remove("active"),
                        this.classList.add("active"),
                        e.calculate({
                            x: e.markers.list[e.markers.selected].x,
                            y: e.markers.list[e.markers.selected].y
                        }, e.markers.selected))
                    }
                    ))
                }
                )),
                document.querySelectorAll(".samples .col").forEach((function(t) {
                    t.addEventListener("click", (function() {
                        var t = this
                          , r = document.querySelector(".samples .col.selected");
                        t !== r && (r.classList.remove("selected"),
                        t.classList.add("selected"),
                        e.markers.selected = t.dataset.sample,
                        e.clearCanvas(),
                        e.wheel.draw(),
                        e.markers.draw())
                    }
                    ))
                }
                )),
                document.querySelectorAll(".samples .rgb").forEach((function(t) {
                    t.addEventListener("change", (function(t) {
                        var r = this
                          , n = r.closest(".col").dataset.sample
                          , s = 0
                          , i = 0
                          , a = 0;
                        r.classList.contains("r") ? (s = parseInt(r.value),
                        i = parseInt(r.closest(".col").querySelector(".g").value),
                        a = parseInt(r.closest(".col").querySelector(".b").value)) : r.classList.contains("g") ? (s = parseInt(r.closest(".col").querySelector(".r").value),
                        i = parseInt(r.value),
                        a = parseInt(r.closest(".col").querySelector(".b").value)) : (s = parseInt(r.closest(".col").querySelector(".r").value),
                        i = parseInt(r.closest(".col").querySelector(".g").value),
                        a = parseInt(r.value)),
                        isNaN(s) || isNaN(i) || isNaN(a) ? t.preventDefault() : e.fromColor({
                            r: s,
                            g: i,
                            b: a
                        }, n)
                    }
                    ))
                }
                )),
                document.querySelectorAll(".samples .hex").forEach((function(t) {
                    t.addEventListener("change", (function(t) {
                        var r = this.closest(".col").dataset.sample
                          , n = e.calc.hexToRgb(this.value);
                        !n || isNaN(n.r) || isNaN(n.g) || isNaN(n.b) ? t.preventDefault() : e.fromColor(n, r)
                    }
                    ))
                }
                ))
            }
            ))
        }
        ,
        768: () => {
            document.addEventListener("DOMContentLoaded", (function() {
                document.querySelector(".hamburger").addEventListener("click", (function() {
                    document.querySelector("body").classList.toggle("menu-open")
                }
                ))
            }
            ))
        }
        ,
        560: () => {
            document.addEventListener("DOMContentLoaded", (function() {
                var e = document.querySelectorAll(".menu-items a")
                  , t = document.querySelector(".menu-arrow");
                e.forEach((function(e) {
                    e.addEventListener("mouseover", (function() {
                        var r = e.getBoundingClientRect()
                          , n = e.parentElement.getBoundingClientRect()
                          , s = r.top - n.top + r.height / 2 - t.clientHeight / 2;
                        t.style.top = "".concat(s, "px")
                    }
                    ))
                }
                )),
                e.forEach((function(e) {
                    e.addEventListener("click", (function(e) {
                        document.querySelector(".pages").showModal()
                    }
                    ))
                }
                ));
                var r, n, s, i, a = document.querySelector(".main-menu");
                a.addEventListener("touchstart", (function(e) {
                    r = e.touches[0].clientY,
                    s = e.touches[0].clientX
                }
                ), {
                    passive: !0
                }),
                a.addEventListener("touchend", (function(e) {
                    n = e.changedTouches[0].clientY,
                    i = e.changedTouches[0].clientX,
                    (n - r > 50 || i - s > 50) && document.body.classList.remove("menu-open")
                }
                ), {
                    passive: !0
                });
                var o, l, d = document.querySelector(".container.main");
                d.addEventListener("touchstart", (function(e) {
                    o = e.touches[0].clientX
                }
                ), {
                    passive: !0
                }),
                d.addEventListener("touchend", (function(e) {
                    l = e.changedTouches[0].clientX,
                    o - l > 50 && document.body.classList.add("menu-open")
                }
                ), {
                    passive: !0
                })
            }
            ))
        }
        ,
        828: () => {
            document.addEventListener("DOMContentLoaded", (function() {
                function e(e) {
                    e.classList.add("closing"),
                    setTimeout((function() {
                        e.classList.remove("closing"),
                        e.close()
                    }
                    ), 300)
                }
                function t() {
                    n.scroll({
                        left: n.scrollLeft + n.clientWidth,
                        behavior: "smooth"
                    })
                }
                function r() {
                    n.scroll({
                        left: n.scrollLeft - n.clientWidth,
                        behavior: "smooth"
                    })
                }
                document.addEventListener("pageClosed", (function(e) {
                    setTimeout((function() {
                        e.detail.querySelector(".anim-letters-trigger").style.opacity = 0
                    }
                    ), 300)
                }
                )),
                document.addEventListener("pageOpend", (function(e) {
                    "#interactions" == e.detail ? i.classList.add("disabled") : i.classList.remove("disabled"),
                    "#about" == e.detail ? s.classList.add("disabled") : s.classList.remove("disabled")
                }
                ));
                var n = document.querySelector(".pages");
                document.addEventListener("keydown", (function(e) {
                    n.open && (39 == e.keyCode && t(),
                    37 == e.keyCode && r())
                }
                )),
                document.querySelector(".toolbar .close-button").addEventListener("click", (function() {
                    var t = document.querySelector(".page.open");
                    document.dispatchEvent(new CustomEvent("pageClosed",{
                        detail: t
                    })),
                    history.replaceState("", document.title, window.location.pathname + window.location.search),
                    e(n),
                    setTimeout((function() {
                        t.classList.remove("open")
                    }
                    ), 300)
                }
                ));
                var s = document.querySelector(".toolbar .prev-button");
                s.addEventListener("click", (function() {
                    r()
                }
                ));
                var i = document.querySelector(".toolbar .next-button");
                i.addEventListener("click", (function() {
                    t()
                }
                )),
                document.querySelectorAll(".toolbar .scroll-button").forEach((function(e) {
                    e.addEventListener("click", (function() {
                        var e = document.querySelector(".page.open")
                          , t = e.querySelector(".container");
                        e.classList.contains("scrolled-down") ? t.scroll({
                            top: 0,
                            behavior: "smooth"
                        }) : t.scroll({
                            top: t.scrollHeight,
                            behavior: "smooth"
                        })
                    }
                    ))
                }
                )),
                document.querySelectorAll(".page").forEach((function(e) {
                    new IntersectionObserver((function(e) {
                        e.forEach((function(e) {
                            e.isIntersecting ? (e.target.classList.add("open"),
                            history.replaceState("", document.title, window.location.pathname + window.location.search + "#" + e.target.id),
                            document.dispatchEvent(new CustomEvent("pageOpend",{
                                detail: "#" + e.target.id
                            }))) : (e.target.querySelector(".container").scroll({
                                top: 0
                            }),
                            e.target.classList.remove("open"),
                            document.dispatchEvent(new CustomEvent("pageClosed",{
                                detail: e.target
                            })))
                        }
                        ))
                    }
                    ),{
                        threshold: .1
                    }).observe(e)
                }
                )),
                document.querySelectorAll(".page .container").forEach((function(e) {
                    var t = e.closest(".page");
                    e.addEventListener("scroll", (function() {
                        e.scrollTop > e.clientHeight / 2 ? (t.classList.add("scrolled-down"),
                        document.dispatchEvent(new CustomEvent("scrolled-down",{
                            detail: t
                        }))) : t.classList.contains("scrolled-down") && (t.classList.remove("scrolled-down"),
                        document.dispatchEvent(new CustomEvent("scrolled-up",{
                            detail: t
                        })))
                    }
                    ))
                }
                ));
                var a = window.location.hash;
                if (a) {
                    var o = document.querySelector(a);
                    o && document.addEventListener("loading-complete", (function() {
                        n.showModal(),
                        n.scroll({
                            left: o.offsetLeft
                        }),
                        document.dispatchEvent(new CustomEvent("pageOpend",{
                            detail: a
                        })),
                        document.body.classList.add("menu-open"),
                        o.classList.add("open")
                    }
                    ))
                }
                window.addEventListener("popstate", (function() {
                    var t = window.location.hash;
                    if (t) {
                        var r = document.querySelector(t);
                        r && (n.scroll({
                            left: r.offsetLeft
                        }),
                        document.dispatchEvent(new CustomEvent("pageOpend",{
                            detail: t
                        })),
                        r.classList.add("open"))
                    } else
                        e(n),
                        document.querySelector("body").classList.remove("menu-open"),
                        document.querySelectorAll(".page.open").forEach((function(e) {
                            e.classList.remove("open"),
                            e.classList.remove("scrolled-down"),
                            document.dispatchEvent(new CustomEvent("pageClosed",{
                                detail: e
                            }))
                        }
                        ))
                }
                )),
                document.addEventListener("visibilitychange", (function() {
                    document.querySelectorAll(".avatar video").forEach((function(e) {
                        if ("visible" === document.visibilityState && null != e && e.paused) {
                            var t = function() {
                                e.play().catch((function(e) {
                                    return console.log("Playback blocked:", e)
                                }
                                )),
                                document.removeEventListener("touchstart", t),
                                document.removeEventListener("click", t)
                            };
                            document.addEventListener("touchstart", t, {
                                once: !0
                            }),
                            document.addEventListener("click", t, {
                                once: !0
                            })
                        }
                    }
                    ))
                }
                ))
            }
            ))
        }
        ,
        137: () => {
            document.addEventListener("DOMContentLoaded", (function() {
                var e = document.querySelectorAll(".pie-container input");
                document.addEventListener("pageOpend", (function(t) {
                    "#metrics" == t.detail && e.forEach((function(e) {
                        window.innerWidth < 1025 && window.matchMedia("(orientation: portrait)").matches || (e.checked = !0)
                    }
                    ))
                }
                )),
                document.addEventListener("scrolled-down", (function(t) {
                    "metrics" == t.detail.id && e.forEach((function(e) {
                        e.checked = !0
                    }
                    ))
                }
                )),
                document.addEventListener("scrolled-up", (function(t) {
                    "metrics" == t.detail.id && e.forEach((function(e) {
                        e.checked = !1
                    }
                    ))
                }
                )),
                document.addEventListener("pageClosed", (function(t) {
                    "metrics" == t.detail.id && e.forEach((function(e) {
                        e.checked = !1
                    }
                    ))
                }
                ))
            }
            ))
        }
        ,
        492: () => {
            document.addEventListener("DOMContentLoaded", (function() {
                var e = document.querySelectorAll(".resume .position");
                e.forEach((function(e) {
                    new IntersectionObserver((function(e) {
                        e.forEach((function(e) {
                            e.isIntersecting && e.target.classList.add("in-view")
                        }
                        ))
                    }
                    ),{
                        threshold: .3
                    }).observe(e)
                }
                )),
                document.addEventListener("pageClosed", (function(t) {
                    "resume" == t.detail.id && e.forEach((function(e) {
                        e.classList.remove("in-view")
                    }
                    ))
                }
                )),
                document.addEventListener("scrolled-up", (function(t) {
                    e.forEach((function(e) {
                        e.classList.remove("in-view")
                    }
                    )),
                    e.forEach((function(e) {
                        var t = e.getBoundingClientRect();
                        t.top < window.innerHeight && t.bottom > 0 && e.classList.add("in-view")
                    }
                    ))
                }
                ))
            }
            ))
        }
        ,
        967: () => {
            document.addEventListener("DOMContentLoaded", (function() {
                var e = document.querySelectorAll(".testimonial .user");
                e.forEach((function(e) {
                    new IntersectionObserver((function(e) {
                        e.forEach((function(e) {
                            e.isIntersecting && e.target.parentElement.classList.add("in-view")
                        }
                        ))
                    }
                    ),{
                        threshold: 1
                    }).observe(e)
                }
                )),
                document.addEventListener("pageClosed", (function(t) {
                    "testimonials" == t.detail.id && e.forEach((function(e) {
                        e.parentElement.classList.remove("in-view")
                    }
                    ))
                }
                )),
                document.addEventListener("scrolled-up", (function(t) {
                    e.forEach((function(e) {
                        e.parentElement.classList.remove("in-view")
                    }
                    )),
                    e.forEach((function(e) {
                        var t = e.getBoundingClientRect();
                        t.top < window.innerHeight && t.bottom > 0 && e.parentElement.classList.add("in-view")
                    }
                    ))
                }
                ))
            }
            ))
        }
        ,
        807: () => {
            var e = !1;
            function t(t) {
                var r = document.getElementById("content-frame");
                function n() {
                    r.contentWindow.postMessage({
                        action: "setTheme",
                        payload: t
                    }, "https://design-interactions.web.app/")
                }
                r && (e ? n() : r.addEventListener("load", (function() {
                    e = !0,
                    n()
                }
                ), {
                    once: !0
                }))
            }
            document.addEventListener("DOMContentLoaded", (function() {
                var e = document.getElementById("theme-toggle-checkbox")
                  , r = localStorage.getItem("theme") || "dark";
                "light" === r ? (document.body.classList.add("light-theme"),
                e.checked = !0) : (document.body.classList.remove("light-theme"),
                e.checked = !1),
                t(r),
                e.addEventListener("change", (function() {
                    var e = this.checked ? "light" : "dark";
                    document.body.classList.toggle("light-theme", "light" === e),
                    localStorage.setItem("theme", e),
                    t(e)
                }
                ))
            }
            ))
        }
        ,
        319: () => {
            document.addEventListener("DOMContentLoaded", (function() {
                var e = 0
                  , t = !1
                  , r = document.querySelectorAll(".pair");
                function n() {
                    var n = document.querySelector(".font-info")
                      , s = document.querySelector(".switch-btn");
                    if (!t) {
                        t = !0;
                        var i = e;
                        r[i].classList.remove("active"),
                        r[i].classList.add("exiting"),
                        setTimeout((function() {
                            return r[i].classList.remove("exiting")
                        }
                        ), 800),
                        e = (e + 1) % r.length,
                        setTimeout((function() {
                            r[e].classList.add("active")
                        }
                        ), 20),
                        n.textContent = "Font Pair: ".concat(r[e].dataset.font),
                        s.style.transform = "rotate(".concat(90 * e, "deg)"),
                        setTimeout((function() {
                            return t = !1
                        }
                        ), 800)
                    }
                }
                document.querySelector(".switch-btn").addEventListener("click", n);
                var s = setInterval(n, 3e3);
                document.querySelector(".switch-btn").addEventListener("mouseover", (function() {
                    return clearInterval(s)
                }
                )),
                document.querySelector(".switch-btn").addEventListener("mouseleave", (function() {
                    s = setInterval(n, 5e3)
                }
                ))
            }
            ))
        }
    }
      , t = {};
    function r(n) {
        var s = t[n];
        if (void 0 !== s)
            return s.exports;
        var i = t[n] = {
            exports: {}
        };
        return e[n](i, i.exports, r),
        i.exports
    }
    ( () => {
        "use strict";
        r(807),
        r(560),
        r(828);
        var e = {
            update: null,
            begin: null,
            loopBegin: null,
            changeBegin: null,
            change: null,
            changeComplete: null,
            loopComplete: null,
            complete: null,
            loop: 1,
            direction: "normal",
            autoplay: !0,
            timelineOffset: 0
        }
          , t = {
            duration: 1e3,
            delay: 0,
            endDelay: 0,
            easing: "easeOutElastic(1, .5)",
            round: 0
        }
          , n = ["translateX", "translateY", "translateZ", "rotate", "rotateX", "rotateY", "rotateZ", "scale", "scaleX", "scaleY", "scaleZ", "skew", "skewX", "skewY", "perspective", "matrix", "matrix3d"]
          , s = {
            CSS: {},
            springs: {}
        };
        function i(e, t, r) {
            return Math.min(Math.max(e, t), r)
        }
        function a(e, t) {
            return e.indexOf(t) > -1
        }
        function o(e, t) {
            return e.apply(null, t)
        }
        var l = {
            arr: function(e) {
                return Array.isArray(e)
            },
            obj: function(e) {
                return a(Object.prototype.toString.call(e), "Object")
            },
            pth: function(e) {
                return l.obj(e) && e.hasOwnProperty("totalLength")
            },
            svg: function(e) {
                return e instanceof SVGElement
            },
            inp: function(e) {
                return e instanceof HTMLInputElement
            },
            dom: function(e) {
                return e.nodeType || l.svg(e)
            },
            str: function(e) {
                return "string" == typeof e
            },
            fnc: function(e) {
                return "function" == typeof e
            },
            und: function(e) {
                return void 0 === e
            },
            nil: function(e) {
                return l.und(e) || null === e
            },
            hex: function(e) {
                return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(e)
            },
            rgb: function(e) {
                return /^rgb/.test(e)
            },
            hsl: function(e) {
                return /^hsl/.test(e)
            },
            col: function(e) {
                return l.hex(e) || l.rgb(e) || l.hsl(e)
            },
            key: function(r) {
                return !e.hasOwnProperty(r) && !t.hasOwnProperty(r) && "targets" !== r && "keyframes" !== r
            }
        };
        function d(e) {
            var t = /\(([^)]+)\)/.exec(e);
            return t ? t[1].split(",").map((function(e) {
                return parseFloat(e)
            }
            )) : []
        }
        function c(e, t) {
            var r = d(e)
              , n = i(l.und(r[0]) ? 1 : r[0], .1, 100)
              , a = i(l.und(r[1]) ? 100 : r[1], .1, 100)
              , o = i(l.und(r[2]) ? 10 : r[2], .1, 100)
              , c = i(l.und(r[3]) ? 0 : r[3], .1, 100)
              , u = Math.sqrt(a / n)
              , p = o / (2 * Math.sqrt(a * n))
              , f = p < 1 ? u * Math.sqrt(1 - p * p) : 0
              , m = p < 1 ? (p * u - c) / f : -c + u;
            function h(e) {
                var r = t ? t * e / 1e3 : e;
                return r = p < 1 ? Math.exp(-r * p * u) * (1 * Math.cos(f * r) + m * Math.sin(f * r)) : (1 + m * r) * Math.exp(-r * u),
                0 === e || 1 === e ? e : 1 - r
            }
            return t ? h : function() {
                var t = s.springs[e];
                if (t)
                    return t;
                for (var r = 1 / 6, n = 0, i = 0; ; )
                    if (1 === h(n += r)) {
                        if (++i >= 16)
                            break
                    } else
                        i = 0;
                var a = n * r * 1e3;
                return s.springs[e] = a,
                a
            }
        }
        function u(e) {
            return void 0 === e && (e = 10),
            function(t) {
                return Math.ceil(i(t, 1e-6, 1) * e) * (1 / e)
            }
        }
        var p, f, m = function() {
            var e = .1;
            function t(e, t) {
                return 1 - 3 * t + 3 * e
            }
            function r(e, t) {
                return 3 * t - 6 * e
            }
            function n(e) {
                return 3 * e
            }
            function s(e, s, i) {
                return ((t(s, i) * e + r(s, i)) * e + n(s)) * e
            }
            function i(e, s, i) {
                return 3 * t(s, i) * e * e + 2 * r(s, i) * e + n(s)
            }
            return function(t, r, n, a) {
                if (0 <= t && t <= 1 && 0 <= n && n <= 1) {
                    var o = new Float32Array(11);
                    if (t !== r || n !== a)
                        for (var l = 0; l < 11; ++l)
                            o[l] = s(l * e, t, n);
                    return function(e) {
                        return t === r && n === a || 0 === e || 1 === e ? e : s(d(e), r, a)
                    }
                }
                function d(r) {
                    for (var a = 0, l = 1; 10 !== l && o[l] <= r; ++l)
                        a += e;
                    --l;
                    var d = a + (r - o[l]) / (o[l + 1] - o[l]) * e
                      , c = i(d, t, n);
                    return c >= .001 ? function(e, t, r, n) {
                        for (var a = 0; a < 4; ++a) {
                            var o = i(t, r, n);
                            if (0 === o)
                                return t;
                            t -= (s(t, r, n) - e) / o
                        }
                        return t
                    }(r, d, t, n) : 0 === c ? d : function(e, t, r, n, i) {
                        var a, o, l = 0;
                        do {
                            (a = s(o = t + (r - t) / 2, n, i) - e) > 0 ? r = o : t = o
                        } while (Math.abs(a) > 1e-7 && ++l < 10);
                        return o
                    }(r, a, a + e, t, n)
                }
            }
        }(), h = (p = {
            linear: function() {
                return function(e) {
                    return e
                }
            }
        },
        f = {
            Sine: function() {
                return function(e) {
                    return 1 - Math.cos(e * Math.PI / 2)
                }
            },
            Expo: function() {
                return function(e) {
                    return e ? Math.pow(2, 10 * e - 10) : 0
                }
            },
            Circ: function() {
                return function(e) {
                    return 1 - Math.sqrt(1 - e * e)
                }
            },
            Back: function() {
                return function(e) {
                    return e * e * (3 * e - 2)
                }
            },
            Bounce: function() {
                return function(e) {
                    for (var t, r = 4; e < ((t = Math.pow(2, --r)) - 1) / 11; )
                        ;
                    return 1 / Math.pow(4, 3 - r) - 7.5625 * Math.pow((3 * t - 2) / 22 - e, 2)
                }
            },
            Elastic: function(e, t) {
                void 0 === e && (e = 1),
                void 0 === t && (t = .5);
                var r = i(e, 1, 10)
                  , n = i(t, .1, 2);
                return function(e) {
                    return 0 === e || 1 === e ? e : -r * Math.pow(2, 10 * (e - 1)) * Math.sin((e - 1 - n / (2 * Math.PI) * Math.asin(1 / r)) * (2 * Math.PI) / n)
                }
            }
        },
        ["Quad", "Cubic", "Quart", "Quint"].forEach((function(e, t) {
            f[e] = function() {
                return function(e) {
                    return Math.pow(e, t + 2)
                }
            }
        }
        )),
        Object.keys(f).forEach((function(e) {
            var t = f[e];
            p["easeIn" + e] = t,
            p["easeOut" + e] = function(e, r) {
                return function(n) {
                    return 1 - t(e, r)(1 - n)
                }
            }
            ,
            p["easeInOut" + e] = function(e, r) {
                return function(n) {
                    return n < .5 ? t(e, r)(2 * n) / 2 : 1 - t(e, r)(-2 * n + 2) / 2
                }
            }
            ,
            p["easeOutIn" + e] = function(e, r) {
                return function(n) {
                    return n < .5 ? (1 - t(e, r)(1 - 2 * n)) / 2 : (t(e, r)(2 * n - 1) + 1) / 2
                }
            }
        }
        )),
        p);
        function v(e, t) {
            if (l.fnc(e))
                return e;
            var r = e.split("(")[0]
              , n = h[r]
              , s = d(e);
            switch (r) {
            case "spring":
                return c(e, t);
            case "cubicBezier":
                return o(m, s);
            case "steps":
                return o(u, s);
            default:
                return o(n, s)
            }
        }
        function g(e) {
            try {
                return document.querySelectorAll(e)
            } catch (e) {
                return
            }
        }
        function w(e, t) {
            for (var r = e.length, n = arguments.length >= 2 ? arguments[1] : void 0, s = [], i = 0; i < r; i++)
                if (i in e) {
                    var a = e[i];
                    t.call(n, a, i, e) && s.push(a)
                }
            return s
        }
        function y(e) {
            return e.reduce((function(e, t) {
                return e.concat(l.arr(t) ? y(t) : t)
            }
            ), [])
        }
        function b(e) {
            return l.arr(e) ? e : (l.str(e) && (e = g(e) || e),
            e instanceof NodeList || e instanceof HTMLCollection ? [].slice.call(e) : [e])
        }
        function S(e, t) {
            return e.some((function(e) {
                return e === t
            }
            ))
        }
        function T(e) {
            var t = {};
            for (var r in e)
                t[r] = e[r];
            return t
        }
        function x(e, t) {
            var r = T(e);
            for (var n in e)
                r[n] = t.hasOwnProperty(n) ? t[n] : e[n];
            return r
        }
        function E(e, t) {
            var r = T(e);
            for (var n in t)
                r[n] = l.und(e[n]) ? t[n] : e[n];
            return r
        }
        function M(e) {
            return l.rgb(e) ? (r = /rgb\((\d+,\s*[\d]+,\s*[\d]+)\)/g.exec(t = e)) ? "rgba(" + r[1] + ",1)" : t : l.hex(e) ? function(e) {
                var t = e.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (function(e, t, r, n) {
                    return t + t + r + r + n + n
                }
                ))
                  , r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);
                return "rgba(" + parseInt(r[1], 16) + "," + parseInt(r[2], 16) + "," + parseInt(r[3], 16) + ",1)"
            }(e) : l.hsl(e) ? function(e) {
                var t, r, n, s = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(e) || /hsla\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*([\d.]+)\)/g.exec(e), i = parseInt(s[1], 10) / 360, a = parseInt(s[2], 10) / 100, o = parseInt(s[3], 10) / 100, l = s[4] || 1;
                function d(e, t, r) {
                    return r < 0 && (r += 1),
                    r > 1 && (r -= 1),
                    r < 1 / 6 ? e + 6 * (t - e) * r : r < .5 ? t : r < 2 / 3 ? e + (t - e) * (2 / 3 - r) * 6 : e
                }
                if (0 == a)
                    t = r = n = o;
                else {
                    var c = o < .5 ? o * (1 + a) : o + a - o * a
                      , u = 2 * o - c;
                    t = d(u, c, i + 1 / 3),
                    r = d(u, c, i),
                    n = d(u, c, i - 1 / 3)
                }
                return "rgba(" + 255 * t + "," + 255 * r + "," + 255 * n + "," + l + ")"
            }(e) : void 0;
            var t, r
        }
        function k(e) {
            var t = /[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/.exec(e);
            if (t)
                return t[1]
        }
        function L(e, t) {
            return l.fnc(e) ? e(t.target, t.id, t.total) : e
        }
        function C(e, t) {
            return e.getAttribute(t)
        }
        function P(e, t, r) {
            if (S([r, "deg", "rad", "turn"], k(t)))
                return t;
            var n = s.CSS[t + r];
            if (!l.und(n))
                return n;
            var i = document.createElement(e.tagName)
              , a = e.parentNode && e.parentNode !== document ? e.parentNode : document.body;
            a.appendChild(i),
            i.style.position = "absolute",
            i.style.width = 100 + r;
            var o = 100 / i.offsetWidth;
            a.removeChild(i);
            var d = o * parseFloat(t);
            return s.CSS[t + r] = d,
            d
        }
        function I(e, t, r) {
            if (t in e.style) {
                var n = t.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
                  , s = e.style[t] || getComputedStyle(e).getPropertyValue(n) || "0";
                return r ? P(e, s, r) : s
            }
        }
        function O(e, t) {
            return l.dom(e) && !l.inp(e) && (!l.nil(C(e, t)) || l.svg(e) && e[t]) ? "attribute" : l.dom(e) && S(n, t) ? "transform" : l.dom(e) && "transform" !== t && I(e, t) ? "css" : null != e[t] ? "object" : void 0
        }
        function A(e) {
            if (l.dom(e)) {
                for (var t, r = e.style.transform || "", n = /(\w+)\(([^)]*)\)/g, s = new Map; t = n.exec(r); )
                    s.set(t[1], t[2]);
                return s
            }
        }
        function z(e, t, r, n) {
            var s = a(t, "scale") ? 1 : 0 + function(e) {
                return a(e, "translate") || "perspective" === e ? "px" : a(e, "rotate") || a(e, "skew") ? "deg" : void 0
            }(t)
              , i = A(e).get(t) || s;
            return r && (r.transforms.list.set(t, i),
            r.transforms.last = t),
            n ? P(e, i, n) : i
        }
        function D(e, t, r, n) {
            switch (O(e, t)) {
            case "transform":
                return z(e, t, n, r);
            case "css":
                return I(e, t, r);
            case "attribute":
                return C(e, t);
            default:
                return e[t] || 0
            }
        }
        function q(e, t) {
            var r = /^(\*=|\+=|-=)/.exec(e);
            if (!r)
                return e;
            var n = k(e) || 0
              , s = parseFloat(t)
              , i = parseFloat(e.replace(r[0], ""));
            switch (r[0][0]) {
            case "+":
                return s + i + n;
            case "-":
                return s - i + n;
            case "*":
                return s * i + n
            }
        }
        function G(e, t) {
            if (l.col(e))
                return M(e);
            if (/\s/g.test(e))
                return e;
            var r = k(e)
              , n = r ? e.substr(0, e.length - r.length) : e;
            return t ? n + t : n
        }
        function R(e, t) {
            return Math.sqrt(Math.pow(t.x - e.x, 2) + Math.pow(t.y - e.y, 2))
        }
        function B(e) {
            for (var t, r = e.points, n = 0, s = 0; s < r.numberOfItems; s++) {
                var i = r.getItem(s);
                s > 0 && (n += R(t, i)),
                t = i
            }
            return n
        }
        function N(e) {
            if (e.getTotalLength)
                return e.getTotalLength();
            switch (e.tagName.toLowerCase()) {
            case "circle":
                return function(e) {
                    return 2 * Math.PI * C(e, "r")
                }(e);
            case "rect":
                return function(e) {
                    return 2 * C(e, "width") + 2 * C(e, "height")
                }(e);
            case "line":
                return function(e) {
                    return R({
                        x: C(e, "x1"),
                        y: C(e, "y1")
                    }, {
                        x: C(e, "x2"),
                        y: C(e, "y2")
                    })
                }(e);
            case "polyline":
                return B(e);
            case "polygon":
                return function(e) {
                    var t = e.points;
                    return B(e) + R(t.getItem(t.numberOfItems - 1), t.getItem(0))
                }(e)
            }
        }
        function _(e, t) {
            var r = t || {}
              , n = r.el || function(e) {
                for (var t = e.parentNode; l.svg(t) && l.svg(t.parentNode); )
                    t = t.parentNode;
                return t
            }(e)
              , s = n.getBoundingClientRect()
              , i = C(n, "viewBox")
              , a = s.width
              , o = s.height
              , d = r.viewBox || (i ? i.split(" ") : [0, 0, a, o]);
            return {
                el: n,
                viewBox: d,
                x: d[0] / 1,
                y: d[1] / 1,
                w: a,
                h: o,
                vW: d[2],
                vH: d[3]
            }
        }
        function F(e, t, r) {
            function n(r) {
                void 0 === r && (r = 0);
                var n = t + r >= 1 ? t + r : 0;
                return e.el.getPointAtLength(n)
            }
            var s = _(e.el, e.svg)
              , i = n()
              , a = n(-1)
              , o = n(1)
              , l = r ? 1 : s.w / s.vW
              , d = r ? 1 : s.h / s.vH;
            switch (e.property) {
            case "x":
                return (i.x - s.x) * l;
            case "y":
                return (i.y - s.y) * d;
            case "angle":
                return 180 * Math.atan2(o.y - a.y, o.x - a.x) / Math.PI
            }
        }
        function V(e, t) {
            var r = /[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g
              , n = G(l.pth(e) ? e.totalLength : e, t) + "";
            return {
                original: n,
                numbers: n.match(r) ? n.match(r).map(Number) : [0],
                strings: l.str(e) || t ? n.split(r) : []
            }
        }
        function $(e) {
            return w(e ? y(l.arr(e) ? e.map(b) : b(e)) : [], (function(e, t, r) {
                return r.indexOf(e) === t
            }
            ))
        }
        function H(e) {
            var t = $(e);
            return t.map((function(e, r) {
                return {
                    target: e,
                    id: r,
                    total: t.length,
                    transforms: {
                        list: A(e)
                    }
                }
            }
            ))
        }
        function j(e, t) {
            var r = T(t);
            if (/^spring/.test(r.easing) && (r.duration = c(r.easing)),
            l.arr(e)) {
                var n = e.length;
                2 === n && !l.obj(e[0]) ? e = {
                    value: e
                } : l.fnc(t.duration) || (r.duration = t.duration / n)
            }
            var s = l.arr(e) ? e : [e];
            return s.map((function(e, r) {
                var n = l.obj(e) && !l.pth(e) ? e : {
                    value: e
                };
                return l.und(n.delay) && (n.delay = r ? 0 : t.delay),
                l.und(n.endDelay) && (n.endDelay = r === s.length - 1 ? t.endDelay : 0),
                n
            }
            )).map((function(e) {
                return E(e, r)
            }
            ))
        }
        function W(e, t) {
            var r = []
              , n = t.keyframes;
            for (var s in n && (t = E(function(e) {
                for (var t = w(y(e.map((function(e) {
                    return Object.keys(e)
                }
                ))), (function(e) {
                    return l.key(e)
                }
                )).reduce((function(e, t) {
                    return e.indexOf(t) < 0 && e.push(t),
                    e
                }
                ), []), r = {}, n = function(n) {
                    var s = t[n];
                    r[s] = e.map((function(e) {
                        var t = {};
                        for (var r in e)
                            l.key(r) ? r == s && (t.value = e[r]) : t[r] = e[r];
                        return t
                    }
                    ))
                }, s = 0; s < t.length; s++)
                    n(s);
                return r
            }(n), t)),
            t)
                l.key(s) && r.push({
                    name: s,
                    tweens: j(t[s], e)
                });
            return r
        }
        function X(e, t) {
            var r;
            return e.tweens.map((function(n) {
                var s = function(e, t) {
                    var r = {};
                    for (var n in e) {
                        var s = L(e[n], t);
                        l.arr(s) && 1 === (s = s.map((function(e) {
                            return L(e, t)
                        }
                        ))).length && (s = s[0]),
                        r[n] = s
                    }
                    return r.duration = parseFloat(r.duration),
                    r.delay = parseFloat(r.delay),
                    r
                }(n, t)
                  , i = s.value
                  , a = l.arr(i) ? i[1] : i
                  , o = k(a)
                  , d = D(t.target, e.name, o, t)
                  , c = r ? r.to.original : d
                  , u = l.arr(i) ? i[0] : c
                  , p = k(u) || k(d)
                  , f = o || p;
                return l.und(a) && (a = c),
                s.from = V(u, f),
                s.to = V(q(a, u), f),
                s.start = r ? r.end : 0,
                s.end = s.start + s.delay + s.duration + s.endDelay,
                s.easing = v(s.easing, s.duration),
                s.isPath = l.pth(i),
                s.isPathTargetInsideSVG = s.isPath && l.svg(t.target),
                s.isColor = l.col(s.from.original),
                s.isColor && (s.round = 1),
                r = s,
                s
            }
            ))
        }
        var Y = {
            css: function(e, t, r) {
                return e.style[t] = r
            },
            attribute: function(e, t, r) {
                return e.setAttribute(t, r)
            },
            object: function(e, t, r) {
                return e[t] = r
            },
            transform: function(e, t, r, n, s) {
                if (n.list.set(t, r),
                t === n.last || s) {
                    var i = "";
                    n.list.forEach((function(e, t) {
                        i += t + "(" + e + ") "
                    }
                    )),
                    e.style.transform = i
                }
            }
        };
        function U(e, t) {
            H(e).forEach((function(e) {
                for (var r in t) {
                    var n = L(t[r], e)
                      , s = e.target
                      , i = k(n)
                      , a = D(s, r, i, e)
                      , o = q(G(n, i || k(a)), a)
                      , l = O(s, r);
                    Y[l](s, r, o, e.transforms, !0)
                }
            }
            ))
        }
        function K(e, t) {
            return w(y(e.map((function(e) {
                return t.map((function(t) {
                    return function(e, t) {
                        var r = O(e.target, t.name);
                        if (r) {
                            var n = X(t, e)
                              , s = n[n.length - 1];
                            return {
                                type: r,
                                property: t.name,
                                animatable: e,
                                tweens: n,
                                duration: s.end,
                                delay: n[0].delay,
                                endDelay: s.endDelay
                            }
                        }
                    }(e, t)
                }
                ))
            }
            ))), (function(e) {
                return !l.und(e)
            }
            ))
        }
        function Z(e, t) {
            var r = e.length
              , n = function(e) {
                return e.timelineOffset ? e.timelineOffset : 0
            }
              , s = {};
            return s.duration = r ? Math.max.apply(Math, e.map((function(e) {
                return n(e) + e.duration
            }
            ))) : t.duration,
            s.delay = r ? Math.min.apply(Math, e.map((function(e) {
                return n(e) + e.delay
            }
            ))) : t.delay,
            s.endDelay = r ? s.duration - Math.max.apply(Math, e.map((function(e) {
                return n(e) + e.duration - e.endDelay
            }
            ))) : t.endDelay,
            s
        }
        var Q = 0;
        var J = []
          , ee = function() {
            var e;
            function t(r) {
                for (var n = J.length, s = 0; s < n; ) {
                    var i = J[s];
                    i.paused ? (J.splice(s, 1),
                    n--) : (i.tick(r),
                    s++)
                }
                e = s > 0 ? requestAnimationFrame(t) : void 0
            }
            return "undefined" != typeof document && document.addEventListener("visibilitychange", (function() {
                re.suspendWhenDocumentHidden && (te() ? e = cancelAnimationFrame(e) : (J.forEach((function(e) {
                    return e._onDocumentVisibility()
                }
                )),
                ee()))
            }
            )),
            function() {
                e || te() && re.suspendWhenDocumentHidden || !(J.length > 0) || (e = requestAnimationFrame(t))
            }
        }();
        function te() {
            return !!document && document.hidden
        }
        function re(r) {
            void 0 === r && (r = {});
            var n, s = 0, a = 0, o = 0, l = 0, d = null;
            function c(e) {
                var t = window.Promise && new Promise((function(e) {
                    return d = e
                }
                ));
                return e.finished = t,
                t
            }
            var u = function(r) {
                var n = x(e, r)
                  , s = x(t, r)
                  , i = W(s, r)
                  , a = H(r.targets)
                  , o = K(a, i)
                  , l = Z(o, s)
                  , d = Q;
                return Q++,
                E(n, {
                    id: d,
                    children: [],
                    animatables: a,
                    animations: o,
                    duration: l.duration,
                    delay: l.delay,
                    endDelay: l.endDelay
                })
            }(r);
            c(u);
            function p() {
                var e = u.direction;
                "alternate" !== e && (u.direction = "normal" !== e ? "normal" : "reverse"),
                u.reversed = !u.reversed,
                n.forEach((function(e) {
                    return e.reversed = u.reversed
                }
                ))
            }
            function f(e) {
                return u.reversed ? u.duration - e : e
            }
            function m() {
                s = 0,
                a = f(u.currentTime) * (1 / re.speed)
            }
            function h(e, t) {
                t && t.seek(e - t.timelineOffset)
            }
            function v(e) {
                for (var t = 0, r = u.animations, n = r.length; t < n; ) {
                    var s = r[t]
                      , a = s.animatable
                      , o = s.tweens
                      , l = o.length - 1
                      , d = o[l];
                    l && (d = w(o, (function(t) {
                        return e < t.end
                    }
                    ))[0] || d);
                    for (var c = i(e - d.start - d.delay, 0, d.duration) / d.duration, p = isNaN(c) ? 1 : d.easing(c), f = d.to.strings, m = d.round, h = [], v = d.to.numbers.length, g = void 0, y = 0; y < v; y++) {
                        var b = void 0
                          , S = d.to.numbers[y]
                          , T = d.from.numbers[y] || 0;
                        b = d.isPath ? F(d.value, p * S, d.isPathTargetInsideSVG) : T + p * (S - T),
                        m && (d.isColor && y > 2 || (b = Math.round(b * m) / m)),
                        h.push(b)
                    }
                    var x = f.length;
                    if (x) {
                        g = f[0];
                        for (var E = 0; E < x; E++) {
                            f[E];
                            var M = f[E + 1]
                              , k = h[E];
                            isNaN(k) || (g += M ? k + M : k + " ")
                        }
                    } else
                        g = h[0];
                    Y[s.type](a.target, s.property, g, a.transforms),
                    s.currentValue = g,
                    t++
                }
            }
            function g(e) {
                u[e] && !u.passThrough && u[e](u)
            }
            function y(e) {
                var t = u.duration
                  , r = u.delay
                  , m = t - u.endDelay
                  , w = f(e);
                u.progress = i(w / t * 100, 0, 100),
                u.reversePlayback = w < u.currentTime,
                n && function(e) {
                    if (u.reversePlayback)
                        for (var t = l; t--; )
                            h(e, n[t]);
                    else
                        for (var r = 0; r < l; r++)
                            h(e, n[r])
                }(w),
                !u.began && u.currentTime > 0 && (u.began = !0,
                g("begin")),
                !u.loopBegan && u.currentTime > 0 && (u.loopBegan = !0,
                g("loopBegin")),
                w <= r && 0 !== u.currentTime && v(0),
                (w >= m && u.currentTime !== t || !t) && v(t),
                w > r && w < m ? (u.changeBegan || (u.changeBegan = !0,
                u.changeCompleted = !1,
                g("changeBegin")),
                g("change"),
                v(w)) : u.changeBegan && (u.changeCompleted = !0,
                u.changeBegan = !1,
                g("changeComplete")),
                u.currentTime = i(w, 0, t),
                u.began && g("update"),
                e >= t && (a = 0,
                u.remaining && !0 !== u.remaining && u.remaining--,
                u.remaining ? (s = o,
                g("loopComplete"),
                u.loopBegan = !1,
                "alternate" === u.direction && p()) : (u.paused = !0,
                u.completed || (u.completed = !0,
                g("loopComplete"),
                g("complete"),
                !u.passThrough && "Promise"in window && (d(),
                c(u)))))
            }
            return u.reset = function() {
                var e = u.direction;
                u.passThrough = !1,
                u.currentTime = 0,
                u.progress = 0,
                u.paused = !0,
                u.began = !1,
                u.loopBegan = !1,
                u.changeBegan = !1,
                u.completed = !1,
                u.changeCompleted = !1,
                u.reversePlayback = !1,
                u.reversed = "reverse" === e,
                u.remaining = u.loop,
                n = u.children;
                for (var t = l = n.length; t--; )
                    u.children[t].reset();
                (u.reversed && !0 !== u.loop || "alternate" === e && 1 === u.loop) && u.remaining++,
                v(u.reversed ? u.duration : 0)
            }
            ,
            u._onDocumentVisibility = m,
            u.set = function(e, t) {
                return U(e, t),
                u
            }
            ,
            u.tick = function(e) {
                o = e,
                s || (s = o),
                y((o + (a - s)) * re.speed)
            }
            ,
            u.seek = function(e) {
                y(f(e))
            }
            ,
            u.pause = function() {
                u.paused = !0,
                m()
            }
            ,
            u.play = function() {
                u.paused && (u.completed && u.reset(),
                u.paused = !1,
                J.push(u),
                m(),
                ee())
            }
            ,
            u.reverse = function() {
                p(),
                u.completed = !u.reversed,
                m()
            }
            ,
            u.restart = function() {
                u.reset(),
                u.play()
            }
            ,
            u.remove = function(e) {
                se($(e), u)
            }
            ,
            u.reset(),
            u.autoplay && u.play(),
            u
        }
        function ne(e, t) {
            for (var r = t.length; r--; )
                S(e, t[r].animatable.target) && t.splice(r, 1)
        }
        function se(e, t) {
            var r = t.animations
              , n = t.children;
            ne(e, r);
            for (var s = n.length; s--; ) {
                var i = n[s]
                  , a = i.animations;
                ne(e, a),
                a.length || i.children.length || n.splice(s, 1)
            }
            r.length || n.length || t.pause()
        }
        re.version = "3.2.1",
        re.speed = 1,
        re.suspendWhenDocumentHidden = !0,
        re.running = J,
        re.remove = function(e) {
            for (var t = $(e), r = J.length; r--; ) {
                se(t, J[r])
            }
        }
        ,
        re.get = D,
        re.set = U,
        re.convertPx = P,
        re.path = function(e, t) {
            var r = l.str(e) ? g(e)[0] : e
              , n = t || 100;
            return function(e) {
                return {
                    property: e,
                    el: r,
                    svg: _(r),
                    totalLength: N(r) * (n / 100)
                }
            }
        }
        ,
        re.setDashoffset = function(e) {
            var t = N(e);
            return e.setAttribute("stroke-dasharray", t),
            t
        }
        ,
        re.stagger = function(e, t) {
            void 0 === t && (t = {});
            var r = t.direction || "normal"
              , n = t.easing ? v(t.easing) : null
              , s = t.grid
              , i = t.axis
              , a = t.from || 0
              , o = "first" === a
              , d = "center" === a
              , c = "last" === a
              , u = l.arr(e)
              , p = u ? parseFloat(e[0]) : parseFloat(e)
              , f = u ? parseFloat(e[1]) : 0
              , m = k(u ? e[1] : e) || 0
              , h = t.start || 0 + (u ? p : 0)
              , g = []
              , w = 0;
            return function(e, t, l) {
                if (o && (a = 0),
                d && (a = (l - 1) / 2),
                c && (a = l - 1),
                !g.length) {
                    for (var v = 0; v < l; v++) {
                        if (s) {
                            var y = d ? (s[0] - 1) / 2 : a % s[0]
                              , b = d ? (s[1] - 1) / 2 : Math.floor(a / s[0])
                              , S = y - v % s[0]
                              , T = b - Math.floor(v / s[0])
                              , x = Math.sqrt(S * S + T * T);
                            "x" === i && (x = -S),
                            "y" === i && (x = -T),
                            g.push(x)
                        } else
                            g.push(Math.abs(a - v));
                        w = Math.max.apply(Math, g)
                    }
                    n && (g = g.map((function(e) {
                        return n(e / w) * w
                    }
                    ))),
                    "reverse" === r && (g = g.map((function(e) {
                        return i ? e < 0 ? -1 * e : -e : Math.abs(w - e)
                    }
                    )))
                }
                return h + (u ? (f - p) / w : p) * (Math.round(100 * g[t]) / 100) + m
            }
        }
        ,
        re.timeline = function(e) {
            void 0 === e && (e = {});
            var r = re(e);
            return r.duration = 0,
            r.add = function(n, s) {
                var i = J.indexOf(r)
                  , a = r.children;
                function o(e) {
                    e.passThrough = !0
                }
                i > -1 && J.splice(i, 1);
                for (var d = 0; d < a.length; d++)
                    o(a[d]);
                var c = E(n, x(t, e));
                c.targets = c.targets || e.targets;
                var u = r.duration;
                c.autoplay = !1,
                c.direction = r.direction,
                c.timelineOffset = l.und(s) ? u : q(s, u),
                o(r),
                r.seek(c.timelineOffset);
                var p = re(c);
                o(p),
                a.push(p);
                var f = Z(a, e);
                return r.delay = f.delay,
                r.endDelay = f.endDelay,
                r.duration = f.duration,
                r.seek(0),
                r.reset(),
                r.autoplay && r.play(),
                r
            }
            ,
            r
        }
        ,
        re.easing = v,
        re.penner = h,
        re.random = function(e, t) {
            return Math.floor(Math.random() * (t - e + 1)) + e
        }
        ;
        const ie = re;
        document.querySelectorAll(".anim-letters").forEach((function(e) {
            e.style.opacity = 1,
            e.innerHTML = e.textContent.replace(/(\S+)/g, "<span class='word'>$&</span>")
        }
        )),
        document.addEventListener("loading-complete", (function(e) {
            ie.timeline().add({
                targets: ".word",
                opacity: [0, 1],
                easing: "easeOutExpo",
                duration: 2e3,
                offset: "-=775",
                delay: function(e, t) {
                    return 40 * (t + 1)
                }
            })
        }
        ));
        var ae = document.querySelectorAll(".anim-letters-trigger");
        ae.forEach((function(e) {
            e.innerHTML = e.textContent.replace(/(\S+)/g, "<span class='word-trigger'>$&</span>")
        }
        )),
        document.addEventListener("pageOpend", (function(e) {
            !function(e) {
                ae.forEach((function(t) {
                    null != t.closest(e.detail) && (ie.timeline().add({
                        targets: t.querySelectorAll(".word-trigger"),
                        opacity: [0, 1],
                        easing: "easeOutExpo",
                        duration: 2e3,
                        offset: "-=775",
                        delay: function(e, t) {
                            return 40 * (t + 1)
                        }
                    }),
                    setTimeout((function() {
                        t.style.opacity = 1
                    }
                    ), 300))
                }
                ))
            }(e)
        }
        ));
        r(768);
        function oe(e) {
            return null !== e && "object" == typeof e && "constructor"in e && e.constructor === Object
        }
        function le(e, t) {
            void 0 === e && (e = {}),
            void 0 === t && (t = {}),
            Object.keys(t).forEach((r => {
                void 0 === e[r] ? e[r] = t[r] : oe(t[r]) && oe(e[r]) && Object.keys(t[r]).length > 0 && le(e[r], t[r])
            }
            ))
        }
        const de = {
            body: {},
            addEventListener() {},
            removeEventListener() {},
            activeElement: {
                blur() {},
                nodeName: ""
            },
            querySelector: () => null,
            querySelectorAll: () => [],
            getElementById: () => null,
            createEvent: () => ({
                initEvent() {}
            }),
            createElement: () => ({
                children: [],
                childNodes: [],
                style: {},
                setAttribute() {},
                getElementsByTagName: () => []
            }),
            createElementNS: () => ({}),
            importNode: () => null,
            location: {
                hash: "",
                host: "",
                hostname: "",
                href: "",
                origin: "",
                pathname: "",
                protocol: "",
                search: ""
            }
        };
        function ce() {
            const e = "undefined" != typeof document ? document : {};
            return le(e, de),
            e
        }
        const ue = {
            document: de,
            navigator: {
                userAgent: ""
            },
            location: {
                hash: "",
                host: "",
                hostname: "",
                href: "",
                origin: "",
                pathname: "",
                protocol: "",
                search: ""
            },
            history: {
                replaceState() {},
                pushState() {},
                go() {},
                back() {}
            },
            CustomEvent: function() {
                return this
            },
            addEventListener() {},
            removeEventListener() {},
            getComputedStyle: () => ({
                getPropertyValue: () => ""
            }),
            Image() {},
            Date() {},
            screen: {},
            setTimeout() {},
            clearTimeout() {},
            matchMedia: () => ({}),
            requestAnimationFrame: e => "undefined" == typeof setTimeout ? (e(),
            null) : setTimeout(e, 0),
            cancelAnimationFrame(e) {
                "undefined" != typeof setTimeout && clearTimeout(e)
            }
        };
        function pe() {
            const e = "undefined" != typeof window ? window : {};
            return le(e, ue),
            e
        }
        function fe(e, t) {
            return void 0 === t && (t = 0),
            setTimeout(e, t)
        }
        function me() {
            return Date.now()
        }
        function he(e, t) {
            void 0 === t && (t = "x");
            const r = pe();
            let n, s, i;
            const a = function(e) {
                const t = pe();
                let r;
                return t.getComputedStyle && (r = t.getComputedStyle(e, null)),
                !r && e.currentStyle && (r = e.currentStyle),
                r || (r = e.style),
                r
            }(e);
            return r.WebKitCSSMatrix ? (s = a.transform || a.webkitTransform,
            s.split(",").length > 6 && (s = s.split(", ").map((e => e.replace(",", "."))).join(", ")),
            i = new r.WebKitCSSMatrix("none" === s ? "" : s)) : (i = a.MozTransform || a.OTransform || a.MsTransform || a.msTransform || a.transform || a.getPropertyValue("transform").replace("translate(", "matrix(1, 0, 0, 1,"),
            n = i.toString().split(",")),
            "x" === t && (s = r.WebKitCSSMatrix ? i.m41 : 16 === n.length ? parseFloat(n[12]) : parseFloat(n[4])),
            "y" === t && (s = r.WebKitCSSMatrix ? i.m42 : 16 === n.length ? parseFloat(n[13]) : parseFloat(n[5])),
            s || 0
        }
        function ve(e) {
            return "object" == typeof e && null !== e && e.constructor && "Object" === Object.prototype.toString.call(e).slice(8, -1)
        }
        function ge() {
            const e = Object(arguments.length <= 0 ? void 0 : arguments[0])
              , t = ["__proto__", "constructor", "prototype"];
            for (let n = 1; n < arguments.length; n += 1) {
                const s = n < 0 || arguments.length <= n ? void 0 : arguments[n];
                if (null != s && (r = s,
                !("undefined" != typeof window && void 0 !== window.HTMLElement ? r instanceof HTMLElement : r && (1 === r.nodeType || 11 === r.nodeType)))) {
                    const r = Object.keys(Object(s)).filter((e => t.indexOf(e) < 0));
                    for (let t = 0, n = r.length; t < n; t += 1) {
                        const n = r[t]
                          , i = Object.getOwnPropertyDescriptor(s, n);
                        void 0 !== i && i.enumerable && (ve(e[n]) && ve(s[n]) ? s[n].__swiper__ ? e[n] = s[n] : ge(e[n], s[n]) : !ve(e[n]) && ve(s[n]) ? (e[n] = {},
                        s[n].__swiper__ ? e[n] = s[n] : ge(e[n], s[n])) : e[n] = s[n])
                    }
                }
            }
            var r;
            return e
        }
        function we(e, t, r) {
            e.style.setProperty(t, r)
        }
        function ye(e) {
            let {swiper: t, targetPosition: r, side: n} = e;
            const s = pe()
              , i = -t.translate;
            let a, o = null;
            const l = t.params.speed;
            t.wrapperEl.style.scrollSnapType = "none",
            s.cancelAnimationFrame(t.cssModeFrameID);
            const d = r > i ? "next" : "prev"
              , c = (e, t) => "next" === d && e >= t || "prev" === d && e <= t
              , u = () => {
                a = (new Date).getTime(),
                null === o && (o = a);
                const e = Math.max(Math.min((a - o) / l, 1), 0)
                  , d = .5 - Math.cos(e * Math.PI) / 2;
                let p = i + d * (r - i);
                if (c(p, r) && (p = r),
                t.wrapperEl.scrollTo({
                    [n]: p
                }),
                c(p, r))
                    return t.wrapperEl.style.overflow = "hidden",
                    t.wrapperEl.style.scrollSnapType = "",
                    setTimeout(( () => {
                        t.wrapperEl.style.overflow = "",
                        t.wrapperEl.scrollTo({
                            [n]: p
                        })
                    }
                    )),
                    void s.cancelAnimationFrame(t.cssModeFrameID);
                t.cssModeFrameID = s.requestAnimationFrame(u)
            }
            ;
            u()
        }
        function be(e) {
            return e.querySelector(".swiper-slide-transform") || e.shadowRoot && e.shadowRoot.querySelector(".swiper-slide-transform") || e
        }
        function Se(e, t) {
            void 0 === t && (t = "");
            const r = pe()
              , n = [...e.children];
            return r.HTMLSlotElement && e instanceof HTMLSlotElement && n.push(...e.assignedElements()),
            t ? n.filter((e => e.matches(t))) : n
        }
        function Te(e) {
            try {
                return void console.warn(e)
            } catch (e) {}
        }
        function xe(e, t) {
            void 0 === t && (t = []);
            const r = document.createElement(e);
            return r.classList.add(...Array.isArray(t) ? t : function(e) {
                return void 0 === e && (e = ""),
                e.trim().split(" ").filter((e => !!e.trim()))
            }(t)),
            r
        }
        function Ee(e, t) {
            return pe().getComputedStyle(e, null).getPropertyValue(t)
        }
        function Me(e) {
            let t, r = e;
            if (r) {
                for (t = 0; null !== (r = r.previousSibling); )
                    1 === r.nodeType && (t += 1);
                return t
            }
        }
        function ke(e, t, r) {
            const n = pe();
            return r ? e["width" === t ? "offsetWidth" : "offsetHeight"] + parseFloat(n.getComputedStyle(e, null).getPropertyValue("width" === t ? "margin-right" : "margin-top")) + parseFloat(n.getComputedStyle(e, null).getPropertyValue("width" === t ? "margin-left" : "margin-bottom")) : e.offsetWidth
        }
        let Le, Ce, Pe;
        function Ie() {
            return Le || (Le = function() {
                const e = pe()
                  , t = ce();
                return {
                    smoothScroll: t.documentElement && t.documentElement.style && "scrollBehavior"in t.documentElement.style,
                    touch: !!("ontouchstart"in e || e.DocumentTouch && t instanceof e.DocumentTouch)
                }
            }()),
            Le
        }
        function Oe(e) {
            return void 0 === e && (e = {}),
            Ce || (Ce = function(e) {
                let {userAgent: t} = void 0 === e ? {} : e;
                const r = Ie()
                  , n = pe()
                  , s = n.navigator.platform
                  , i = t || n.navigator.userAgent
                  , a = {
                    ios: !1,
                    android: !1
                }
                  , o = n.screen.width
                  , l = n.screen.height
                  , d = i.match(/(Android);?[\s\/]+([\d.]+)?/);
                let c = i.match(/(iPad).*OS\s([\d_]+)/);
                const u = i.match(/(iPod)(.*OS\s([\d_]+))?/)
                  , p = !c && i.match(/(iPhone\sOS|iOS)\s([\d_]+)/)
                  , f = "Win32" === s;
                let m = "MacIntel" === s;
                return !c && m && r.touch && ["1024x1366", "1366x1024", "834x1194", "1194x834", "834x1112", "1112x834", "768x1024", "1024x768", "820x1180", "1180x820", "810x1080", "1080x810"].indexOf(`${o}x${l}`) >= 0 && (c = i.match(/(Version)\/([\d.]+)/),
                c || (c = [0, 1, "13_0_0"]),
                m = !1),
                d && !f && (a.os = "android",
                a.android = !0),
                (c || p || u) && (a.os = "ios",
                a.ios = !0),
                a
            }(e)),
            Ce
        }
        function Ae() {
            return Pe || (Pe = function() {
                const e = pe()
                  , t = Oe();
                let r = !1;
                function n() {
                    const t = e.navigator.userAgent.toLowerCase();
                    return t.indexOf("safari") >= 0 && t.indexOf("chrome") < 0 && t.indexOf("android") < 0
                }
                if (n()) {
                    const t = String(e.navigator.userAgent);
                    if (t.includes("Version/")) {
                        const [e,n] = t.split("Version/")[1].split(" ")[0].split(".").map((e => Number(e)));
                        r = e < 16 || 16 === e && n < 2
                    }
                }
                const s = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(e.navigator.userAgent)
                  , i = n();
                return {
                    isSafari: r || i,
                    needPerspectiveFix: r,
                    need3dFix: i || s && t.ios,
                    isWebView: s
                }
            }()),
            Pe
        }
        var ze = {
            on(e, t, r) {
                const n = this;
                if (!n.eventsListeners || n.destroyed)
                    return n;
                if ("function" != typeof t)
                    return n;
                const s = r ? "unshift" : "push";
                return e.split(" ").forEach((e => {
                    n.eventsListeners[e] || (n.eventsListeners[e] = []),
                    n.eventsListeners[e][s](t)
                }
                )),
                n
            },
            once(e, t, r) {
                const n = this;
                if (!n.eventsListeners || n.destroyed)
                    return n;
                if ("function" != typeof t)
                    return n;
                function s() {
                    n.off(e, s),
                    s.__emitterProxy && delete s.__emitterProxy;
                    for (var r = arguments.length, i = new Array(r), a = 0; a < r; a++)
                        i[a] = arguments[a];
                    t.apply(n, i)
                }
                return s.__emitterProxy = t,
                n.on(e, s, r)
            },
            onAny(e, t) {
                const r = this;
                if (!r.eventsListeners || r.destroyed)
                    return r;
                if ("function" != typeof e)
                    return r;
                const n = t ? "unshift" : "push";
                return r.eventsAnyListeners.indexOf(e) < 0 && r.eventsAnyListeners[n](e),
                r
            },
            offAny(e) {
                const t = this;
                if (!t.eventsListeners || t.destroyed)
                    return t;
                if (!t.eventsAnyListeners)
                    return t;
                const r = t.eventsAnyListeners.indexOf(e);
                return r >= 0 && t.eventsAnyListeners.splice(r, 1),
                t
            },
            off(e, t) {
                const r = this;
                return !r.eventsListeners || r.destroyed ? r : r.eventsListeners ? (e.split(" ").forEach((e => {
                    void 0 === t ? r.eventsListeners[e] = [] : r.eventsListeners[e] && r.eventsListeners[e].forEach(( (n, s) => {
                        (n === t || n.__emitterProxy && n.__emitterProxy === t) && r.eventsListeners[e].splice(s, 1)
                    }
                    ))
                }
                )),
                r) : r
            },
            emit() {
                const e = this;
                if (!e.eventsListeners || e.destroyed)
                    return e;
                if (!e.eventsListeners)
                    return e;
                let t, r, n;
                for (var s = arguments.length, i = new Array(s), a = 0; a < s; a++)
                    i[a] = arguments[a];
                "string" == typeof i[0] || Array.isArray(i[0]) ? (t = i[0],
                r = i.slice(1, i.length),
                n = e) : (t = i[0].events,
                r = i[0].data,
                n = i[0].context || e),
                r.unshift(n);
                return (Array.isArray(t) ? t : t.split(" ")).forEach((t => {
                    e.eventsAnyListeners && e.eventsAnyListeners.length && e.eventsAnyListeners.forEach((e => {
                        e.apply(n, [t, ...r])
                    }
                    )),
                    e.eventsListeners && e.eventsListeners[t] && e.eventsListeners[t].forEach((e => {
                        e.apply(n, r)
                    }
                    ))
                }
                )),
                e
            }
        };
        const De = (e, t, r) => {
            t && !e.classList.contains(r) ? e.classList.add(r) : !t && e.classList.contains(r) && e.classList.remove(r)
        }
        ;
        const qe = (e, t, r) => {
            t && !e.classList.contains(r) ? e.classList.add(r) : !t && e.classList.contains(r) && e.classList.remove(r)
        }
        ;
        const Ge = (e, t) => {
            if (!e || e.destroyed || !e.params)
                return;
            const r = t.closest(e.isElement ? "swiper-slide" : `.${e.params.slideClass}`);
            if (r) {
                let t = r.querySelector(`.${e.params.lazyPreloaderClass}`);
                !t && e.isElement && (r.shadowRoot ? t = r.shadowRoot.querySelector(`.${e.params.lazyPreloaderClass}`) : requestAnimationFrame(( () => {
                    r.shadowRoot && (t = r.shadowRoot.querySelector(`.${e.params.lazyPreloaderClass}`),
                    t && t.remove())
                }
                ))),
                t && t.remove()
            }
        }
          , Re = (e, t) => {
            if (!e.slides[t])
                return;
            const r = e.slides[t].querySelector('[loading="lazy"]');
            r && r.removeAttribute("loading")
        }
          , Be = e => {
            if (!e || e.destroyed || !e.params)
                return;
            let t = e.params.lazyPreloadPrevNext;
            const r = e.slides.length;
            if (!r || !t || t < 0)
                return;
            t = Math.min(t, r);
            const n = "auto" === e.params.slidesPerView ? e.slidesPerViewDynamic() : Math.ceil(e.params.slidesPerView)
              , s = e.activeIndex;
            if (e.params.grid && e.params.grid.rows > 1) {
                const r = s
                  , i = [r - t];
                return i.push(...Array.from({
                    length: t
                }).map(( (e, t) => r + n + t))),
                void e.slides.forEach(( (t, r) => {
                    i.includes(t.column) && Re(e, r)
                }
                ))
            }
            const i = s + n - 1;
            if (e.params.rewind || e.params.loop)
                for (let n = s - t; n <= i + t; n += 1) {
                    const t = (n % r + r) % r;
                    (t < s || t > i) && Re(e, t)
                }
            else
                for (let n = Math.max(s - t, 0); n <= Math.min(i + t, r - 1); n += 1)
                    n !== s && (n > i || n < s) && Re(e, n)
        }
        ;
        var Ne = {
            updateSize: function() {
                const e = this;
                let t, r;
                const n = e.el;
                t = void 0 !== e.params.width && null !== e.params.width ? e.params.width : n.clientWidth,
                r = void 0 !== e.params.height && null !== e.params.height ? e.params.height : n.clientHeight,
                0 === t && e.isHorizontal() || 0 === r && e.isVertical() || (t = t - parseInt(Ee(n, "padding-left") || 0, 10) - parseInt(Ee(n, "padding-right") || 0, 10),
                r = r - parseInt(Ee(n, "padding-top") || 0, 10) - parseInt(Ee(n, "padding-bottom") || 0, 10),
                Number.isNaN(t) && (t = 0),
                Number.isNaN(r) && (r = 0),
                Object.assign(e, {
                    width: t,
                    height: r,
                    size: e.isHorizontal() ? t : r
                }))
            },
            updateSlides: function() {
                const e = this;
                function t(t, r) {
                    return parseFloat(t.getPropertyValue(e.getDirectionLabel(r)) || 0)
                }
                const r = e.params
                  , {wrapperEl: n, slidesEl: s, size: i, rtlTranslate: a, wrongRTL: o} = e
                  , l = e.virtual && r.virtual.enabled
                  , d = l ? e.virtual.slides.length : e.slides.length
                  , c = Se(s, `.${e.params.slideClass}, swiper-slide`)
                  , u = l ? e.virtual.slides.length : c.length;
                let p = [];
                const f = []
                  , m = [];
                let h = r.slidesOffsetBefore;
                "function" == typeof h && (h = r.slidesOffsetBefore.call(e));
                let v = r.slidesOffsetAfter;
                "function" == typeof v && (v = r.slidesOffsetAfter.call(e));
                const g = e.snapGrid.length
                  , w = e.slidesGrid.length;
                let y = r.spaceBetween
                  , b = -h
                  , S = 0
                  , T = 0;
                if (void 0 === i)
                    return;
                "string" == typeof y && y.indexOf("%") >= 0 ? y = parseFloat(y.replace("%", "")) / 100 * i : "string" == typeof y && (y = parseFloat(y)),
                e.virtualSize = -y,
                c.forEach((e => {
                    a ? e.style.marginLeft = "" : e.style.marginRight = "",
                    e.style.marginBottom = "",
                    e.style.marginTop = ""
                }
                )),
                r.centeredSlides && r.cssMode && (we(n, "--swiper-centered-offset-before", ""),
                we(n, "--swiper-centered-offset-after", ""));
                const x = r.grid && r.grid.rows > 1 && e.grid;
                let E;
                x ? e.grid.initSlides(c) : e.grid && e.grid.unsetSlides();
                const M = "auto" === r.slidesPerView && r.breakpoints && Object.keys(r.breakpoints).filter((e => void 0 !== r.breakpoints[e].slidesPerView)).length > 0;
                for (let n = 0; n < u; n += 1) {
                    let s;
                    if (E = 0,
                    c[n] && (s = c[n]),
                    x && e.grid.updateSlide(n, s, c),
                    !c[n] || "none" !== Ee(s, "display")) {
                        if ("auto" === r.slidesPerView) {
                            M && (c[n].style[e.getDirectionLabel("width")] = "");
                            const i = getComputedStyle(s)
                              , a = s.style.transform
                              , o = s.style.webkitTransform;
                            if (a && (s.style.transform = "none"),
                            o && (s.style.webkitTransform = "none"),
                            r.roundLengths)
                                E = e.isHorizontal() ? ke(s, "width", !0) : ke(s, "height", !0);
                            else {
                                const e = t(i, "width")
                                  , r = t(i, "padding-left")
                                  , n = t(i, "padding-right")
                                  , a = t(i, "margin-left")
                                  , o = t(i, "margin-right")
                                  , l = i.getPropertyValue("box-sizing");
                                if (l && "border-box" === l)
                                    E = e + a + o;
                                else {
                                    const {clientWidth: t, offsetWidth: i} = s;
                                    E = e + r + n + a + o + (i - t)
                                }
                            }
                            a && (s.style.transform = a),
                            o && (s.style.webkitTransform = o),
                            r.roundLengths && (E = Math.floor(E))
                        } else
                            E = (i - (r.slidesPerView - 1) * y) / r.slidesPerView,
                            r.roundLengths && (E = Math.floor(E)),
                            c[n] && (c[n].style[e.getDirectionLabel("width")] = `${E}px`);
                        c[n] && (c[n].swiperSlideSize = E),
                        m.push(E),
                        r.centeredSlides ? (b = b + E / 2 + S / 2 + y,
                        0 === S && 0 !== n && (b = b - i / 2 - y),
                        0 === n && (b = b - i / 2 - y),
                        Math.abs(b) < .001 && (b = 0),
                        r.roundLengths && (b = Math.floor(b)),
                        T % r.slidesPerGroup == 0 && p.push(b),
                        f.push(b)) : (r.roundLengths && (b = Math.floor(b)),
                        (T - Math.min(e.params.slidesPerGroupSkip, T)) % e.params.slidesPerGroup == 0 && p.push(b),
                        f.push(b),
                        b = b + E + y),
                        e.virtualSize += E + y,
                        S = E,
                        T += 1
                    }
                }
                if (e.virtualSize = Math.max(e.virtualSize, i) + v,
                a && o && ("slide" === r.effect || "coverflow" === r.effect) && (n.style.width = `${e.virtualSize + y}px`),
                r.setWrapperSize && (n.style[e.getDirectionLabel("width")] = `${e.virtualSize + y}px`),
                x && e.grid.updateWrapperSize(E, p),
                !r.centeredSlides) {
                    const t = [];
                    for (let n = 0; n < p.length; n += 1) {
                        let s = p[n];
                        r.roundLengths && (s = Math.floor(s)),
                        p[n] <= e.virtualSize - i && t.push(s)
                    }
                    p = t,
                    Math.floor(e.virtualSize - i) - Math.floor(p[p.length - 1]) > 1 && p.push(e.virtualSize - i)
                }
                if (l && r.loop) {
                    const t = m[0] + y;
                    if (r.slidesPerGroup > 1) {
                        const n = Math.ceil((e.virtual.slidesBefore + e.virtual.slidesAfter) / r.slidesPerGroup)
                          , s = t * r.slidesPerGroup;
                        for (let e = 0; e < n; e += 1)
                            p.push(p[p.length - 1] + s)
                    }
                    for (let n = 0; n < e.virtual.slidesBefore + e.virtual.slidesAfter; n += 1)
                        1 === r.slidesPerGroup && p.push(p[p.length - 1] + t),
                        f.push(f[f.length - 1] + t),
                        e.virtualSize += t
                }
                if (0 === p.length && (p = [0]),
                0 !== y) {
                    const t = e.isHorizontal() && a ? "marginLeft" : e.getDirectionLabel("marginRight");
                    c.filter(( (e, t) => !(r.cssMode && !r.loop) || t !== c.length - 1)).forEach((e => {
                        e.style[t] = `${y}px`
                    }
                    ))
                }
                if (r.centeredSlides && r.centeredSlidesBounds) {
                    let e = 0;
                    m.forEach((t => {
                        e += t + (y || 0)
                    }
                    )),
                    e -= y;
                    const t = e > i ? e - i : 0;
                    p = p.map((e => e <= 0 ? -h : e > t ? t + v : e))
                }
                if (r.centerInsufficientSlides) {
                    let e = 0;
                    m.forEach((t => {
                        e += t + (y || 0)
                    }
                    )),
                    e -= y;
                    const t = (r.slidesOffsetBefore || 0) + (r.slidesOffsetAfter || 0);
                    if (e + t < i) {
                        const r = (i - e - t) / 2;
                        p.forEach(( (e, t) => {
                            p[t] = e - r
                        }
                        )),
                        f.forEach(( (e, t) => {
                            f[t] = e + r
                        }
                        ))
                    }
                }
                if (Object.assign(e, {
                    slides: c,
                    snapGrid: p,
                    slidesGrid: f,
                    slidesSizesGrid: m
                }),
                r.centeredSlides && r.cssMode && !r.centeredSlidesBounds) {
                    we(n, "--swiper-centered-offset-before", -p[0] + "px"),
                    we(n, "--swiper-centered-offset-after", e.size / 2 - m[m.length - 1] / 2 + "px");
                    const t = -e.snapGrid[0]
                      , r = -e.slidesGrid[0];
                    e.snapGrid = e.snapGrid.map((e => e + t)),
                    e.slidesGrid = e.slidesGrid.map((e => e + r))
                }
                if (u !== d && e.emit("slidesLengthChange"),
                p.length !== g && (e.params.watchOverflow && e.checkOverflow(),
                e.emit("snapGridLengthChange")),
                f.length !== w && e.emit("slidesGridLengthChange"),
                r.watchSlidesProgress && e.updateSlidesOffset(),
                e.emit("slidesUpdated"),
                !(l || r.cssMode || "slide" !== r.effect && "fade" !== r.effect)) {
                    const t = `${r.containerModifierClass}backface-hidden`
                      , n = e.el.classList.contains(t);
                    u <= r.maxBackfaceHiddenSlides ? n || e.el.classList.add(t) : n && e.el.classList.remove(t)
                }
            },
            updateAutoHeight: function(e) {
                const t = this
                  , r = []
                  , n = t.virtual && t.params.virtual.enabled;
                let s, i = 0;
                "number" == typeof e ? t.setTransition(e) : !0 === e && t.setTransition(t.params.speed);
                const a = e => n ? t.slides[t.getSlideIndexByData(e)] : t.slides[e];
                if ("auto" !== t.params.slidesPerView && t.params.slidesPerView > 1)
                    if (t.params.centeredSlides)
                        (t.visibleSlides || []).forEach((e => {
                            r.push(e)
                        }
                        ));
                    else
                        for (s = 0; s < Math.ceil(t.params.slidesPerView); s += 1) {
                            const e = t.activeIndex + s;
                            if (e > t.slides.length && !n)
                                break;
                            r.push(a(e))
                        }
                else
                    r.push(a(t.activeIndex));
                for (s = 0; s < r.length; s += 1)
                    if (void 0 !== r[s]) {
                        const e = r[s].offsetHeight;
                        i = e > i ? e : i
                    }
                (i || 0 === i) && (t.wrapperEl.style.height = `${i}px`)
            },
            updateSlidesOffset: function() {
                const e = this
                  , t = e.slides
                  , r = e.isElement ? e.isHorizontal() ? e.wrapperEl.offsetLeft : e.wrapperEl.offsetTop : 0;
                for (let n = 0; n < t.length; n += 1)
                    t[n].swiperSlideOffset = (e.isHorizontal() ? t[n].offsetLeft : t[n].offsetTop) - r - e.cssOverflowAdjustment()
            },
            updateSlidesProgress: function(e) {
                void 0 === e && (e = this && this.translate || 0);
                const t = this
                  , r = t.params
                  , {slides: n, rtlTranslate: s, snapGrid: i} = t;
                if (0 === n.length)
                    return;
                void 0 === n[0].swiperSlideOffset && t.updateSlidesOffset();
                let a = -e;
                s && (a = e),
                t.visibleSlidesIndexes = [],
                t.visibleSlides = [];
                let o = r.spaceBetween;
                "string" == typeof o && o.indexOf("%") >= 0 ? o = parseFloat(o.replace("%", "")) / 100 * t.size : "string" == typeof o && (o = parseFloat(o));
                for (let e = 0; e < n.length; e += 1) {
                    const l = n[e];
                    let d = l.swiperSlideOffset;
                    r.cssMode && r.centeredSlides && (d -= n[0].swiperSlideOffset);
                    const c = (a + (r.centeredSlides ? t.minTranslate() : 0) - d) / (l.swiperSlideSize + o)
                      , u = (a - i[0] + (r.centeredSlides ? t.minTranslate() : 0) - d) / (l.swiperSlideSize + o)
                      , p = -(a - d)
                      , f = p + t.slidesSizesGrid[e]
                      , m = p >= 0 && p <= t.size - t.slidesSizesGrid[e]
                      , h = p >= 0 && p < t.size - 1 || f > 1 && f <= t.size || p <= 0 && f >= t.size;
                    h && (t.visibleSlides.push(l),
                    t.visibleSlidesIndexes.push(e)),
                    De(l, h, r.slideVisibleClass),
                    De(l, m, r.slideFullyVisibleClass),
                    l.progress = s ? -c : c,
                    l.originalProgress = s ? -u : u
                }
            },
            updateProgress: function(e) {
                const t = this;
                if (void 0 === e) {
                    const r = t.rtlTranslate ? -1 : 1;
                    e = t && t.translate && t.translate * r || 0
                }
                const r = t.params
                  , n = t.maxTranslate() - t.minTranslate();
                let {progress: s, isBeginning: i, isEnd: a, progressLoop: o} = t;
                const l = i
                  , d = a;
                if (0 === n)
                    s = 0,
                    i = !0,
                    a = !0;
                else {
                    s = (e - t.minTranslate()) / n;
                    const r = Math.abs(e - t.minTranslate()) < 1
                      , o = Math.abs(e - t.maxTranslate()) < 1;
                    i = r || s <= 0,
                    a = o || s >= 1,
                    r && (s = 0),
                    o && (s = 1)
                }
                if (r.loop) {
                    const r = t.getSlideIndexByData(0)
                      , n = t.getSlideIndexByData(t.slides.length - 1)
                      , s = t.slidesGrid[r]
                      , i = t.slidesGrid[n]
                      , a = t.slidesGrid[t.slidesGrid.length - 1]
                      , l = Math.abs(e);
                    o = l >= s ? (l - s) / a : (l + a - i) / a,
                    o > 1 && (o -= 1)
                }
                Object.assign(t, {
                    progress: s,
                    progressLoop: o,
                    isBeginning: i,
                    isEnd: a
                }),
                (r.watchSlidesProgress || r.centeredSlides && r.autoHeight) && t.updateSlidesProgress(e),
                i && !l && t.emit("reachBeginning toEdge"),
                a && !d && t.emit("reachEnd toEdge"),
                (l && !i || d && !a) && t.emit("fromEdge"),
                t.emit("progress", s)
            },
            updateSlidesClasses: function() {
                const e = this
                  , {slides: t, params: r, slidesEl: n, activeIndex: s} = e
                  , i = e.virtual && r.virtual.enabled
                  , a = e.grid && r.grid && r.grid.rows > 1
                  , o = e => Se(n, `.${r.slideClass}${e}, swiper-slide${e}`)[0];
                let l, d, c;
                if (i)
                    if (r.loop) {
                        let t = s - e.virtual.slidesBefore;
                        t < 0 && (t = e.virtual.slides.length + t),
                        t >= e.virtual.slides.length && (t -= e.virtual.slides.length),
                        l = o(`[data-swiper-slide-index="${t}"]`)
                    } else
                        l = o(`[data-swiper-slide-index="${s}"]`);
                else
                    a ? (l = t.find((e => e.column === s)),
                    c = t.find((e => e.column === s + 1)),
                    d = t.find((e => e.column === s - 1))) : l = t[s];
                l && (a || (c = function(e, t) {
                    const r = [];
                    for (; e.nextElementSibling; ) {
                        const n = e.nextElementSibling;
                        t ? n.matches(t) && r.push(n) : r.push(n),
                        e = n
                    }
                    return r
                }(l, `.${r.slideClass}, swiper-slide`)[0],
                r.loop && !c && (c = t[0]),
                d = function(e, t) {
                    const r = [];
                    for (; e.previousElementSibling; ) {
                        const n = e.previousElementSibling;
                        t ? n.matches(t) && r.push(n) : r.push(n),
                        e = n
                    }
                    return r
                }(l, `.${r.slideClass}, swiper-slide`)[0],
                r.loop && 0 === !d && (d = t[t.length - 1]))),
                t.forEach((e => {
                    qe(e, e === l, r.slideActiveClass),
                    qe(e, e === c, r.slideNextClass),
                    qe(e, e === d, r.slidePrevClass)
                }
                )),
                e.emitSlidesClasses()
            },
            updateActiveIndex: function(e) {
                const t = this
                  , r = t.rtlTranslate ? t.translate : -t.translate
                  , {snapGrid: n, params: s, activeIndex: i, realIndex: a, snapIndex: o} = t;
                let l, d = e;
                const c = e => {
                    let r = e - t.virtual.slidesBefore;
                    return r < 0 && (r = t.virtual.slides.length + r),
                    r >= t.virtual.slides.length && (r -= t.virtual.slides.length),
                    r
                }
                ;
                if (void 0 === d && (d = function(e) {
                    const {slidesGrid: t, params: r} = e
                      , n = e.rtlTranslate ? e.translate : -e.translate;
                    let s;
                    for (let e = 0; e < t.length; e += 1)
                        void 0 !== t[e + 1] ? n >= t[e] && n < t[e + 1] - (t[e + 1] - t[e]) / 2 ? s = e : n >= t[e] && n < t[e + 1] && (s = e + 1) : n >= t[e] && (s = e);
                    return r.normalizeSlideIndex && (s < 0 || void 0 === s) && (s = 0),
                    s
                }(t)),
                n.indexOf(r) >= 0)
                    l = n.indexOf(r);
                else {
                    const e = Math.min(s.slidesPerGroupSkip, d);
                    l = e + Math.floor((d - e) / s.slidesPerGroup)
                }
                if (l >= n.length && (l = n.length - 1),
                d === i && !t.params.loop)
                    return void (l !== o && (t.snapIndex = l,
                    t.emit("snapIndexChange")));
                if (d === i && t.params.loop && t.virtual && t.params.virtual.enabled)
                    return void (t.realIndex = c(d));
                const u = t.grid && s.grid && s.grid.rows > 1;
                let p;
                if (t.virtual && s.virtual.enabled && s.loop)
                    p = c(d);
                else if (u) {
                    const e = t.slides.find((e => e.column === d));
                    let r = parseInt(e.getAttribute("data-swiper-slide-index"), 10);
                    Number.isNaN(r) && (r = Math.max(t.slides.indexOf(e), 0)),
                    p = Math.floor(r / s.grid.rows)
                } else if (t.slides[d]) {
                    const e = t.slides[d].getAttribute("data-swiper-slide-index");
                    p = e ? parseInt(e, 10) : d
                } else
                    p = d;
                Object.assign(t, {
                    previousSnapIndex: o,
                    snapIndex: l,
                    previousRealIndex: a,
                    realIndex: p,
                    previousIndex: i,
                    activeIndex: d
                }),
                t.initialized && Be(t),
                t.emit("activeIndexChange"),
                t.emit("snapIndexChange"),
                (t.initialized || t.params.runCallbacksOnInit) && (a !== p && t.emit("realIndexChange"),
                t.emit("slideChange"))
            },
            updateClickedSlide: function(e, t) {
                const r = this
                  , n = r.params;
                let s = e.closest(`.${n.slideClass}, swiper-slide`);
                !s && r.isElement && t && t.length > 1 && t.includes(e) && [...t.slice(t.indexOf(e) + 1, t.length)].forEach((e => {
                    !s && e.matches && e.matches(`.${n.slideClass}, swiper-slide`) && (s = e)
                }
                ));
                let i, a = !1;
                if (s)
                    for (let e = 0; e < r.slides.length; e += 1)
                        if (r.slides[e] === s) {
                            a = !0,
                            i = e;
                            break
                        }
                if (!s || !a)
                    return r.clickedSlide = void 0,
                    void (r.clickedIndex = void 0);
                r.clickedSlide = s,
                r.virtual && r.params.virtual.enabled ? r.clickedIndex = parseInt(s.getAttribute("data-swiper-slide-index"), 10) : r.clickedIndex = i,
                n.slideToClickedSlide && void 0 !== r.clickedIndex && r.clickedIndex !== r.activeIndex && r.slideToClickedSlide()
            }
        };
        var _e = {
            getTranslate: function(e) {
                void 0 === e && (e = this.isHorizontal() ? "x" : "y");
                const {params: t, rtlTranslate: r, translate: n, wrapperEl: s} = this;
                if (t.virtualTranslate)
                    return r ? -n : n;
                if (t.cssMode)
                    return n;
                let i = he(s, e);
                return i += this.cssOverflowAdjustment(),
                r && (i = -i),
                i || 0
            },
            setTranslate: function(e, t) {
                const r = this
                  , {rtlTranslate: n, params: s, wrapperEl: i, progress: a} = r;
                let o, l = 0, d = 0;
                r.isHorizontal() ? l = n ? -e : e : d = e,
                s.roundLengths && (l = Math.floor(l),
                d = Math.floor(d)),
                r.previousTranslate = r.translate,
                r.translate = r.isHorizontal() ? l : d,
                s.cssMode ? i[r.isHorizontal() ? "scrollLeft" : "scrollTop"] = r.isHorizontal() ? -l : -d : s.virtualTranslate || (r.isHorizontal() ? l -= r.cssOverflowAdjustment() : d -= r.cssOverflowAdjustment(),
                i.style.transform = `translate3d(${l}px, ${d}px, 0px)`);
                const c = r.maxTranslate() - r.minTranslate();
                o = 0 === c ? 0 : (e - r.minTranslate()) / c,
                o !== a && r.updateProgress(e),
                r.emit("setTranslate", r.translate, t)
            },
            minTranslate: function() {
                return -this.snapGrid[0]
            },
            maxTranslate: function() {
                return -this.snapGrid[this.snapGrid.length - 1]
            },
            translateTo: function(e, t, r, n, s) {
                void 0 === e && (e = 0),
                void 0 === t && (t = this.params.speed),
                void 0 === r && (r = !0),
                void 0 === n && (n = !0);
                const i = this
                  , {params: a, wrapperEl: o} = i;
                if (i.animating && a.preventInteractionOnTransition)
                    return !1;
                const l = i.minTranslate()
                  , d = i.maxTranslate();
                let c;
                if (c = n && e > l ? l : n && e < d ? d : e,
                i.updateProgress(c),
                a.cssMode) {
                    const e = i.isHorizontal();
                    if (0 === t)
                        o[e ? "scrollLeft" : "scrollTop"] = -c;
                    else {
                        if (!i.support.smoothScroll)
                            return ye({
                                swiper: i,
                                targetPosition: -c,
                                side: e ? "left" : "top"
                            }),
                            !0;
                        o.scrollTo({
                            [e ? "left" : "top"]: -c,
                            behavior: "smooth"
                        })
                    }
                    return !0
                }
                return 0 === t ? (i.setTransition(0),
                i.setTranslate(c),
                r && (i.emit("beforeTransitionStart", t, s),
                i.emit("transitionEnd"))) : (i.setTransition(t),
                i.setTranslate(c),
                r && (i.emit("beforeTransitionStart", t, s),
                i.emit("transitionStart")),
                i.animating || (i.animating = !0,
                i.onTranslateToWrapperTransitionEnd || (i.onTranslateToWrapperTransitionEnd = function(e) {
                    i && !i.destroyed && e.target === this && (i.wrapperEl.removeEventListener("transitionend", i.onTranslateToWrapperTransitionEnd),
                    i.onTranslateToWrapperTransitionEnd = null,
                    delete i.onTranslateToWrapperTransitionEnd,
                    i.animating = !1,
                    r && i.emit("transitionEnd"))
                }
                ),
                i.wrapperEl.addEventListener("transitionend", i.onTranslateToWrapperTransitionEnd))),
                !0
            }
        };
        function Fe(e) {
            let {swiper: t, runCallbacks: r, direction: n, step: s} = e;
            const {activeIndex: i, previousIndex: a} = t;
            let o = n;
            if (o || (o = i > a ? "next" : i < a ? "prev" : "reset"),
            t.emit(`transition${s}`),
            r && i !== a) {
                if ("reset" === o)
                    return void t.emit(`slideResetTransition${s}`);
                t.emit(`slideChangeTransition${s}`),
                "next" === o ? t.emit(`slideNextTransition${s}`) : t.emit(`slidePrevTransition${s}`)
            }
        }
        var Ve = {
            slideTo: function(e, t, r, n, s) {
                void 0 === e && (e = 0),
                void 0 === r && (r = !0),
                "string" == typeof e && (e = parseInt(e, 10));
                const i = this;
                let a = e;
                a < 0 && (a = 0);
                const {params: o, snapGrid: l, slidesGrid: d, previousIndex: c, activeIndex: u, rtlTranslate: p, wrapperEl: f, enabled: m} = i;
                if (!m && !n && !s || i.destroyed || i.animating && o.preventInteractionOnTransition)
                    return !1;
                void 0 === t && (t = i.params.speed);
                const h = Math.min(i.params.slidesPerGroupSkip, a);
                let v = h + Math.floor((a - h) / i.params.slidesPerGroup);
                v >= l.length && (v = l.length - 1);
                const g = -l[v];
                if (o.normalizeSlideIndex)
                    for (let e = 0; e < d.length; e += 1) {
                        const t = -Math.floor(100 * g)
                          , r = Math.floor(100 * d[e])
                          , n = Math.floor(100 * d[e + 1]);
                        void 0 !== d[e + 1] ? t >= r && t < n - (n - r) / 2 ? a = e : t >= r && t < n && (a = e + 1) : t >= r && (a = e)
                    }
                if (i.initialized && a !== u) {
                    if (!i.allowSlideNext && (p ? g > i.translate && g > i.minTranslate() : g < i.translate && g < i.minTranslate()))
                        return !1;
                    if (!i.allowSlidePrev && g > i.translate && g > i.maxTranslate() && (u || 0) !== a)
                        return !1
                }
                let w;
                a !== (c || 0) && r && i.emit("beforeSlideChangeStart"),
                i.updateProgress(g),
                w = a > u ? "next" : a < u ? "prev" : "reset";
                const y = i.virtual && i.params.virtual.enabled;
                if (!(y && s) && (p && -g === i.translate || !p && g === i.translate))
                    return i.updateActiveIndex(a),
                    o.autoHeight && i.updateAutoHeight(),
                    i.updateSlidesClasses(),
                    "slide" !== o.effect && i.setTranslate(g),
                    "reset" !== w && (i.transitionStart(r, w),
                    i.transitionEnd(r, w)),
                    !1;
                if (o.cssMode) {
                    const e = i.isHorizontal()
                      , r = p ? g : -g;
                    if (0 === t)
                        y && (i.wrapperEl.style.scrollSnapType = "none",
                        i._immediateVirtual = !0),
                        y && !i._cssModeVirtualInitialSet && i.params.initialSlide > 0 ? (i._cssModeVirtualInitialSet = !0,
                        requestAnimationFrame(( () => {
                            f[e ? "scrollLeft" : "scrollTop"] = r
                        }
                        ))) : f[e ? "scrollLeft" : "scrollTop"] = r,
                        y && requestAnimationFrame(( () => {
                            i.wrapperEl.style.scrollSnapType = "",
                            i._immediateVirtual = !1
                        }
                        ));
                    else {
                        if (!i.support.smoothScroll)
                            return ye({
                                swiper: i,
                                targetPosition: r,
                                side: e ? "left" : "top"
                            }),
                            !0;
                        f.scrollTo({
                            [e ? "left" : "top"]: r,
                            behavior: "smooth"
                        })
                    }
                    return !0
                }
                return i.setTransition(t),
                i.setTranslate(g),
                i.updateActiveIndex(a),
                i.updateSlidesClasses(),
                i.emit("beforeTransitionStart", t, n),
                i.transitionStart(r, w),
                0 === t ? i.transitionEnd(r, w) : i.animating || (i.animating = !0,
                i.onSlideToWrapperTransitionEnd || (i.onSlideToWrapperTransitionEnd = function(e) {
                    i && !i.destroyed && e.target === this && (i.wrapperEl.removeEventListener("transitionend", i.onSlideToWrapperTransitionEnd),
                    i.onSlideToWrapperTransitionEnd = null,
                    delete i.onSlideToWrapperTransitionEnd,
                    i.transitionEnd(r, w))
                }
                ),
                i.wrapperEl.addEventListener("transitionend", i.onSlideToWrapperTransitionEnd)),
                !0
            },
            slideToLoop: function(e, t, r, n) {
                if (void 0 === e && (e = 0),
                void 0 === r && (r = !0),
                "string" == typeof e) {
                    e = parseInt(e, 10)
                }
                const s = this;
                if (s.destroyed)
                    return;
                void 0 === t && (t = s.params.speed);
                const i = s.grid && s.params.grid && s.params.grid.rows > 1;
                let a = e;
                if (s.params.loop)
                    if (s.virtual && s.params.virtual.enabled)
                        a += s.virtual.slidesBefore;
                    else {
                        let e;
                        if (i) {
                            const t = a * s.params.grid.rows;
                            e = s.slides.find((e => 1 * e.getAttribute("data-swiper-slide-index") === t)).column
                        } else
                            e = s.getSlideIndexByData(a);
                        const t = i ? Math.ceil(s.slides.length / s.params.grid.rows) : s.slides.length
                          , {centeredSlides: r} = s.params;
                        let o = s.params.slidesPerView;
                        "auto" === o ? o = s.slidesPerViewDynamic() : (o = Math.ceil(parseFloat(s.params.slidesPerView, 10)),
                        r && o % 2 == 0 && (o += 1));
                        let l = t - e < o;
                        if (r && (l = l || e < Math.ceil(o / 2)),
                        n && r && "auto" !== s.params.slidesPerView && !i && (l = !1),
                        l) {
                            const n = r ? e < s.activeIndex ? "prev" : "next" : e - s.activeIndex - 1 < s.params.slidesPerView ? "next" : "prev";
                            s.loopFix({
                                direction: n,
                                slideTo: !0,
                                activeSlideIndex: "next" === n ? e + 1 : e - t + 1,
                                slideRealIndex: "next" === n ? s.realIndex : void 0
                            })
                        }
                        if (i) {
                            const e = a * s.params.grid.rows;
                            a = s.slides.find((t => 1 * t.getAttribute("data-swiper-slide-index") === e)).column
                        } else
                            a = s.getSlideIndexByData(a)
                    }
                return requestAnimationFrame(( () => {
                    s.slideTo(a, t, r, n)
                }
                )),
                s
            },
            slideNext: function(e, t, r) {
                void 0 === t && (t = !0);
                const n = this
                  , {enabled: s, params: i, animating: a} = n;
                if (!s || n.destroyed)
                    return n;
                void 0 === e && (e = n.params.speed);
                let o = i.slidesPerGroup;
                "auto" === i.slidesPerView && 1 === i.slidesPerGroup && i.slidesPerGroupAuto && (o = Math.max(n.slidesPerViewDynamic("current", !0), 1));
                const l = n.activeIndex < i.slidesPerGroupSkip ? 1 : o
                  , d = n.virtual && i.virtual.enabled;
                if (i.loop) {
                    if (a && !d && i.loopPreventsSliding)
                        return !1;
                    if (n.loopFix({
                        direction: "next"
                    }),
                    n._clientLeft = n.wrapperEl.clientLeft,
                    n.activeIndex === n.slides.length - 1 && i.cssMode)
                        return requestAnimationFrame(( () => {
                            n.slideTo(n.activeIndex + l, e, t, r)
                        }
                        )),
                        !0
                }
                return i.rewind && n.isEnd ? n.slideTo(0, e, t, r) : n.slideTo(n.activeIndex + l, e, t, r)
            },
            slidePrev: function(e, t, r) {
                void 0 === t && (t = !0);
                const n = this
                  , {params: s, snapGrid: i, slidesGrid: a, rtlTranslate: o, enabled: l, animating: d} = n;
                if (!l || n.destroyed)
                    return n;
                void 0 === e && (e = n.params.speed);
                const c = n.virtual && s.virtual.enabled;
                if (s.loop) {
                    if (d && !c && s.loopPreventsSliding)
                        return !1;
                    n.loopFix({
                        direction: "prev"
                    }),
                    n._clientLeft = n.wrapperEl.clientLeft
                }
                function u(e) {
                    return e < 0 ? -Math.floor(Math.abs(e)) : Math.floor(e)
                }
                const p = u(o ? n.translate : -n.translate)
                  , f = i.map((e => u(e)));
                let m = i[f.indexOf(p) - 1];
                if (void 0 === m && s.cssMode) {
                    let e;
                    i.forEach(( (t, r) => {
                        p >= t && (e = r)
                    }
                    )),
                    void 0 !== e && (m = i[e > 0 ? e - 1 : e])
                }
                let h = 0;
                if (void 0 !== m && (h = a.indexOf(m),
                h < 0 && (h = n.activeIndex - 1),
                "auto" === s.slidesPerView && 1 === s.slidesPerGroup && s.slidesPerGroupAuto && (h = h - n.slidesPerViewDynamic("previous", !0) + 1,
                h = Math.max(h, 0))),
                s.rewind && n.isBeginning) {
                    const s = n.params.virtual && n.params.virtual.enabled && n.virtual ? n.virtual.slides.length - 1 : n.slides.length - 1;
                    return n.slideTo(s, e, t, r)
                }
                return s.loop && 0 === n.activeIndex && s.cssMode ? (requestAnimationFrame(( () => {
                    n.slideTo(h, e, t, r)
                }
                )),
                !0) : n.slideTo(h, e, t, r)
            },
            slideReset: function(e, t, r) {
                void 0 === t && (t = !0);
                const n = this;
                if (!n.destroyed)
                    return void 0 === e && (e = n.params.speed),
                    n.slideTo(n.activeIndex, e, t, r)
            },
            slideToClosest: function(e, t, r, n) {
                void 0 === t && (t = !0),
                void 0 === n && (n = .5);
                const s = this;
                if (s.destroyed)
                    return;
                void 0 === e && (e = s.params.speed);
                let i = s.activeIndex;
                const a = Math.min(s.params.slidesPerGroupSkip, i)
                  , o = a + Math.floor((i - a) / s.params.slidesPerGroup)
                  , l = s.rtlTranslate ? s.translate : -s.translate;
                if (l >= s.snapGrid[o]) {
                    const e = s.snapGrid[o];
                    l - e > (s.snapGrid[o + 1] - e) * n && (i += s.params.slidesPerGroup)
                } else {
                    const e = s.snapGrid[o - 1];
                    l - e <= (s.snapGrid[o] - e) * n && (i -= s.params.slidesPerGroup)
                }
                return i = Math.max(i, 0),
                i = Math.min(i, s.slidesGrid.length - 1),
                s.slideTo(i, e, t, r)
            },
            slideToClickedSlide: function() {
                const e = this;
                if (e.destroyed)
                    return;
                const {params: t, slidesEl: r} = e
                  , n = "auto" === t.slidesPerView ? e.slidesPerViewDynamic() : t.slidesPerView;
                let s, i = e.clickedIndex;
                const a = e.isElement ? "swiper-slide" : `.${t.slideClass}`;
                if (t.loop) {
                    if (e.animating)
                        return;
                    s = parseInt(e.clickedSlide.getAttribute("data-swiper-slide-index"), 10),
                    t.centeredSlides ? i < e.loopedSlides - n / 2 || i > e.slides.length - e.loopedSlides + n / 2 ? (e.loopFix(),
                    i = e.getSlideIndex(Se(r, `${a}[data-swiper-slide-index="${s}"]`)[0]),
                    fe(( () => {
                        e.slideTo(i)
                    }
                    ))) : e.slideTo(i) : i > e.slides.length - n ? (e.loopFix(),
                    i = e.getSlideIndex(Se(r, `${a}[data-swiper-slide-index="${s}"]`)[0]),
                    fe(( () => {
                        e.slideTo(i)
                    }
                    ))) : e.slideTo(i)
                } else
                    e.slideTo(i)
            }
        };
        var $e = {
            loopCreate: function(e) {
                const t = this
                  , {params: r, slidesEl: n} = t;
                if (!r.loop || t.virtual && t.params.virtual.enabled)
                    return;
                const s = () => {
                    Se(n, `.${r.slideClass}, swiper-slide`).forEach(( (e, t) => {
                        e.setAttribute("data-swiper-slide-index", t)
                    }
                    ))
                }
                  , i = t.grid && r.grid && r.grid.rows > 1
                  , a = r.slidesPerGroup * (i ? r.grid.rows : 1)
                  , o = t.slides.length % a != 0
                  , l = i && t.slides.length % r.grid.rows != 0
                  , d = e => {
                    for (let n = 0; n < e; n += 1) {
                        const e = t.isElement ? xe("swiper-slide", [r.slideBlankClass]) : xe("div", [r.slideClass, r.slideBlankClass]);
                        t.slidesEl.append(e)
                    }
                }
                ;
                if (o) {
                    if (r.loopAddBlankSlides) {
                        d(a - t.slides.length % a),
                        t.recalcSlides(),
                        t.updateSlides()
                    } else
                        Te("Swiper Loop Warning: The number of slides is not even to slidesPerGroup, loop mode may not function properly. You need to add more slides (or make duplicates, or empty slides)");
                    s()
                } else if (l) {
                    if (r.loopAddBlankSlides) {
                        d(r.grid.rows - t.slides.length % r.grid.rows),
                        t.recalcSlides(),
                        t.updateSlides()
                    } else
                        Te("Swiper Loop Warning: The number of slides is not even to grid.rows, loop mode may not function properly. You need to add more slides (or make duplicates, or empty slides)");
                    s()
                } else
                    s();
                t.loopFix({
                    slideRealIndex: e,
                    direction: r.centeredSlides ? void 0 : "next"
                })
            },
            loopFix: function(e) {
                let {slideRealIndex: t, slideTo: r=!0, direction: n, setTranslate: s, activeSlideIndex: i, byController: a, byMousewheel: o} = void 0 === e ? {} : e;
                const l = this;
                if (!l.params.loop)
                    return;
                l.emit("beforeLoopFix");
                const {slides: d, allowSlidePrev: c, allowSlideNext: u, slidesEl: p, params: f} = l
                  , {centeredSlides: m} = f;
                if (l.allowSlidePrev = !0,
                l.allowSlideNext = !0,
                l.virtual && f.virtual.enabled)
                    return r && (f.centeredSlides || 0 !== l.snapIndex ? f.centeredSlides && l.snapIndex < f.slidesPerView ? l.slideTo(l.virtual.slides.length + l.snapIndex, 0, !1, !0) : l.snapIndex === l.snapGrid.length - 1 && l.slideTo(l.virtual.slidesBefore, 0, !1, !0) : l.slideTo(l.virtual.slides.length, 0, !1, !0)),
                    l.allowSlidePrev = c,
                    l.allowSlideNext = u,
                    void l.emit("loopFix");
                let h = f.slidesPerView;
                "auto" === h ? h = l.slidesPerViewDynamic() : (h = Math.ceil(parseFloat(f.slidesPerView, 10)),
                m && h % 2 == 0 && (h += 1));
                const v = f.slidesPerGroupAuto ? h : f.slidesPerGroup;
                let g = v;
                g % v != 0 && (g += v - g % v),
                g += f.loopAdditionalSlides,
                l.loopedSlides = g;
                const w = l.grid && f.grid && f.grid.rows > 1;
                d.length < h + g ? Te("Swiper Loop Warning: The number of slides is not enough for loop mode, it will be disabled and not function properly. You need to add more slides (or make duplicates) or lower the values of slidesPerView and slidesPerGroup parameters") : w && "row" === f.grid.fill && Te("Swiper Loop Warning: Loop mode is not compatible with grid.fill = `row`");
                const y = []
                  , b = [];
                let S = l.activeIndex;
                void 0 === i ? i = l.getSlideIndex(d.find((e => e.classList.contains(f.slideActiveClass)))) : S = i;
                const T = "next" === n || !n
                  , x = "prev" === n || !n;
                let E = 0
                  , M = 0;
                const k = w ? Math.ceil(d.length / f.grid.rows) : d.length
                  , L = (w ? d[i].column : i) + (m && void 0 === s ? -h / 2 + .5 : 0);
                if (L < g) {
                    E = Math.max(g - L, v);
                    for (let e = 0; e < g - L; e += 1) {
                        const t = e - Math.floor(e / k) * k;
                        if (w) {
                            const e = k - t - 1;
                            for (let t = d.length - 1; t >= 0; t -= 1)
                                d[t].column === e && y.push(t)
                        } else
                            y.push(k - t - 1)
                    }
                } else if (L + h > k - g) {
                    M = Math.max(L - (k - 2 * g), v);
                    for (let e = 0; e < M; e += 1) {
                        const t = e - Math.floor(e / k) * k;
                        w ? d.forEach(( (e, r) => {
                            e.column === t && b.push(r)
                        }
                        )) : b.push(t)
                    }
                }
                if (l.__preventObserver__ = !0,
                requestAnimationFrame(( () => {
                    l.__preventObserver__ = !1
                }
                )),
                x && y.forEach((e => {
                    d[e].swiperLoopMoveDOM = !0,
                    p.prepend(d[e]),
                    d[e].swiperLoopMoveDOM = !1
                }
                )),
                T && b.forEach((e => {
                    d[e].swiperLoopMoveDOM = !0,
                    p.append(d[e]),
                    d[e].swiperLoopMoveDOM = !1
                }
                )),
                l.recalcSlides(),
                "auto" === f.slidesPerView ? l.updateSlides() : w && (y.length > 0 && x || b.length > 0 && T) && l.slides.forEach(( (e, t) => {
                    l.grid.updateSlide(t, e, l.slides)
                }
                )),
                f.watchSlidesProgress && l.updateSlidesOffset(),
                r)
                    if (y.length > 0 && x) {
                        if (void 0 === t) {
                            const e = l.slidesGrid[S]
                              , t = l.slidesGrid[S + E] - e;
                            o ? l.setTranslate(l.translate - t) : (l.slideTo(S + Math.ceil(E), 0, !1, !0),
                            s && (l.touchEventsData.startTranslate = l.touchEventsData.startTranslate - t,
                            l.touchEventsData.currentTranslate = l.touchEventsData.currentTranslate - t))
                        } else if (s) {
                            const e = w ? y.length / f.grid.rows : y.length;
                            l.slideTo(l.activeIndex + e, 0, !1, !0),
                            l.touchEventsData.currentTranslate = l.translate
                        }
                    } else if (b.length > 0 && T)
                        if (void 0 === t) {
                            const e = l.slidesGrid[S]
                              , t = l.slidesGrid[S - M] - e;
                            o ? l.setTranslate(l.translate - t) : (l.slideTo(S - M, 0, !1, !0),
                            s && (l.touchEventsData.startTranslate = l.touchEventsData.startTranslate - t,
                            l.touchEventsData.currentTranslate = l.touchEventsData.currentTranslate - t))
                        } else {
                            const e = w ? b.length / f.grid.rows : b.length;
                            l.slideTo(l.activeIndex - e, 0, !1, !0)
                        }
                if (l.allowSlidePrev = c,
                l.allowSlideNext = u,
                l.controller && l.controller.control && !a) {
                    const e = {
                        slideRealIndex: t,
                        direction: n,
                        setTranslate: s,
                        activeSlideIndex: i,
                        byController: !0
                    };
                    Array.isArray(l.controller.control) ? l.controller.control.forEach((t => {
                        !t.destroyed && t.params.loop && t.loopFix({
                            ...e,
                            slideTo: t.params.slidesPerView === f.slidesPerView && r
                        })
                    }
                    )) : l.controller.control instanceof l.constructor && l.controller.control.params.loop && l.controller.control.loopFix({
                        ...e,
                        slideTo: l.controller.control.params.slidesPerView === f.slidesPerView && r
                    })
                }
                l.emit("loopFix")
            },
            loopDestroy: function() {
                const e = this
                  , {params: t, slidesEl: r} = e;
                if (!t.loop || e.virtual && e.params.virtual.enabled)
                    return;
                e.recalcSlides();
                const n = [];
                e.slides.forEach((e => {
                    const t = void 0 === e.swiperSlideIndex ? 1 * e.getAttribute("data-swiper-slide-index") : e.swiperSlideIndex;
                    n[t] = e
                }
                )),
                e.slides.forEach((e => {
                    e.removeAttribute("data-swiper-slide-index")
                }
                )),
                n.forEach((e => {
                    r.append(e)
                }
                )),
                e.recalcSlides(),
                e.slideTo(e.realIndex, 0)
            }
        };
        function He(e, t, r) {
            const n = pe()
              , {params: s} = e
              , i = s.edgeSwipeDetection
              , a = s.edgeSwipeThreshold;
            return !i || !(r <= a || r >= n.innerWidth - a) || "prevent" === i && (t.preventDefault(),
            !0)
        }
        function je(e) {
            const t = this
              , r = ce();
            let n = e;
            n.originalEvent && (n = n.originalEvent);
            const s = t.touchEventsData;
            if ("pointerdown" === n.type) {
                if (null !== s.pointerId && s.pointerId !== n.pointerId)
                    return;
                s.pointerId = n.pointerId
            } else
                "touchstart" === n.type && 1 === n.targetTouches.length && (s.touchId = n.targetTouches[0].identifier);
            if ("touchstart" === n.type)
                return void He(t, n, n.targetTouches[0].pageX);
            const {params: i, touches: a, enabled: o} = t;
            if (!o)
                return;
            if (!i.simulateTouch && "mouse" === n.pointerType)
                return;
            if (t.animating && i.preventInteractionOnTransition)
                return;
            !t.animating && i.cssMode && i.loop && t.loopFix();
            let l = n.target;
            if ("wrapper" === i.touchEventsTarget && !function(e, t) {
                const r = pe();
                let n = t.contains(e);
                !n && r.HTMLSlotElement && t instanceof HTMLSlotElement && (n = [...t.assignedElements()].includes(e),
                n || (n = function(e, t) {
                    const r = [t];
                    for (; r.length > 0; ) {
                        const t = r.shift();
                        if (e === t)
                            return !0;
                        r.push(...t.children, ...t.shadowRoot?.children || [], ...t.assignedElements?.() || [])
                    }
                }(e, t)));
                return n
            }(l, t.wrapperEl))
                return;
            if ("which"in n && 3 === n.which)
                return;
            if ("button"in n && n.button > 0)
                return;
            if (s.isTouched && s.isMoved)
                return;
            const d = !!i.noSwipingClass && "" !== i.noSwipingClass
              , c = n.composedPath ? n.composedPath() : n.path;
            d && n.target && n.target.shadowRoot && c && (l = c[0]);
            const u = i.noSwipingSelector ? i.noSwipingSelector : `.${i.noSwipingClass}`
              , p = !(!n.target || !n.target.shadowRoot);
            if (i.noSwiping && (p ? function(e, t) {
                return void 0 === t && (t = this),
                function t(r) {
                    if (!r || r === ce() || r === pe())
                        return null;
                    r.assignedSlot && (r = r.assignedSlot);
                    const n = r.closest(e);
                    return n || r.getRootNode ? n || t(r.getRootNode().host) : null
                }(t)
            }(u, l) : l.closest(u)))
                return void (t.allowClick = !0);
            if (i.swipeHandler && !l.closest(i.swipeHandler))
                return;
            a.currentX = n.pageX,
            a.currentY = n.pageY;
            const f = a.currentX
              , m = a.currentY;
            if (!He(t, n, f))
                return;
            Object.assign(s, {
                isTouched: !0,
                isMoved: !1,
                allowTouchCallbacks: !0,
                isScrolling: void 0,
                startMoving: void 0
            }),
            a.startX = f,
            a.startY = m,
            s.touchStartTime = me(),
            t.allowClick = !0,
            t.updateSize(),
            t.swipeDirection = void 0,
            i.threshold > 0 && (s.allowThresholdMove = !1);
            let h = !0;
            l.matches(s.focusableElements) && (h = !1,
            "SELECT" === l.nodeName && (s.isTouched = !1)),
            r.activeElement && r.activeElement.matches(s.focusableElements) && r.activeElement !== l && ("mouse" === n.pointerType || "mouse" !== n.pointerType && !l.matches(s.focusableElements)) && r.activeElement.blur();
            const v = h && t.allowTouchMove && i.touchStartPreventDefault;
            !i.touchStartForcePreventDefault && !v || l.isContentEditable || n.preventDefault(),
            i.freeMode && i.freeMode.enabled && t.freeMode && t.animating && !i.cssMode && t.freeMode.onTouchStart(),
            t.emit("touchStart", n)
        }
        function We(e) {
            const t = ce()
              , r = this
              , n = r.touchEventsData
              , {params: s, touches: i, rtlTranslate: a, enabled: o} = r;
            if (!o)
                return;
            if (!s.simulateTouch && "mouse" === e.pointerType)
                return;
            let l, d = e;
            if (d.originalEvent && (d = d.originalEvent),
            "pointermove" === d.type) {
                if (null !== n.touchId)
                    return;
                if (d.pointerId !== n.pointerId)
                    return
            }
            if ("touchmove" === d.type) {
                if (l = [...d.changedTouches].find((e => e.identifier === n.touchId)),
                !l || l.identifier !== n.touchId)
                    return
            } else
                l = d;
            if (!n.isTouched)
                return void (n.startMoving && n.isScrolling && r.emit("touchMoveOpposite", d));
            const c = l.pageX
              , u = l.pageY;
            if (d.preventedByNestedSwiper)
                return i.startX = c,
                void (i.startY = u);
            if (!r.allowTouchMove)
                return d.target.matches(n.focusableElements) || (r.allowClick = !1),
                void (n.isTouched && (Object.assign(i, {
                    startX: c,
                    startY: u,
                    currentX: c,
                    currentY: u
                }),
                n.touchStartTime = me()));
            if (s.touchReleaseOnEdges && !s.loop)
                if (r.isVertical()) {
                    if (u < i.startY && r.translate <= r.maxTranslate() || u > i.startY && r.translate >= r.minTranslate())
                        return n.isTouched = !1,
                        void (n.isMoved = !1)
                } else if (c < i.startX && r.translate <= r.maxTranslate() || c > i.startX && r.translate >= r.minTranslate())
                    return;
            if (t.activeElement && t.activeElement.matches(n.focusableElements) && t.activeElement !== d.target && "mouse" !== d.pointerType && t.activeElement.blur(),
            t.activeElement && d.target === t.activeElement && d.target.matches(n.focusableElements))
                return n.isMoved = !0,
                void (r.allowClick = !1);
            n.allowTouchCallbacks && r.emit("touchMove", d),
            i.previousX = i.currentX,
            i.previousY = i.currentY,
            i.currentX = c,
            i.currentY = u;
            const p = i.currentX - i.startX
              , f = i.currentY - i.startY;
            if (r.params.threshold && Math.sqrt(p ** 2 + f ** 2) < r.params.threshold)
                return;
            if (void 0 === n.isScrolling) {
                let e;
                r.isHorizontal() && i.currentY === i.startY || r.isVertical() && i.currentX === i.startX ? n.isScrolling = !1 : p * p + f * f >= 25 && (e = 180 * Math.atan2(Math.abs(f), Math.abs(p)) / Math.PI,
                n.isScrolling = r.isHorizontal() ? e > s.touchAngle : 90 - e > s.touchAngle)
            }
            if (n.isScrolling && r.emit("touchMoveOpposite", d),
            void 0 === n.startMoving && (i.currentX === i.startX && i.currentY === i.startY || (n.startMoving = !0)),
            n.isScrolling || "touchmove" === d.type && n.preventTouchMoveFromPointerMove)
                return void (n.isTouched = !1);
            if (!n.startMoving)
                return;
            r.allowClick = !1,
            !s.cssMode && d.cancelable && d.preventDefault(),
            s.touchMoveStopPropagation && !s.nested && d.stopPropagation();
            let m = r.isHorizontal() ? p : f
              , h = r.isHorizontal() ? i.currentX - i.previousX : i.currentY - i.previousY;
            s.oneWayMovement && (m = Math.abs(m) * (a ? 1 : -1),
            h = Math.abs(h) * (a ? 1 : -1)),
            i.diff = m,
            m *= s.touchRatio,
            a && (m = -m,
            h = -h);
            const v = r.touchesDirection;
            r.swipeDirection = m > 0 ? "prev" : "next",
            r.touchesDirection = h > 0 ? "prev" : "next";
            const g = r.params.loop && !s.cssMode
              , w = "next" === r.touchesDirection && r.allowSlideNext || "prev" === r.touchesDirection && r.allowSlidePrev;
            if (!n.isMoved) {
                if (g && w && r.loopFix({
                    direction: r.swipeDirection
                }),
                n.startTranslate = r.getTranslate(),
                r.setTransition(0),
                r.animating) {
                    const e = new window.CustomEvent("transitionend",{
                        bubbles: !0,
                        cancelable: !0,
                        detail: {
                            bySwiperTouchMove: !0
                        }
                    });
                    r.wrapperEl.dispatchEvent(e)
                }
                n.allowMomentumBounce = !1,
                !s.grabCursor || !0 !== r.allowSlideNext && !0 !== r.allowSlidePrev || r.setGrabCursor(!0),
                r.emit("sliderFirstMove", d)
            }
            if ((new Date).getTime(),
            n.isMoved && n.allowThresholdMove && v !== r.touchesDirection && g && w && Math.abs(m) >= 1)
                return Object.assign(i, {
                    startX: c,
                    startY: u,
                    currentX: c,
                    currentY: u,
                    startTranslate: n.currentTranslate
                }),
                n.loopSwapReset = !0,
                void (n.startTranslate = n.currentTranslate);
            r.emit("sliderMove", d),
            n.isMoved = !0,
            n.currentTranslate = m + n.startTranslate;
            let y = !0
              , b = s.resistanceRatio;
            if (s.touchReleaseOnEdges && (b = 0),
            m > 0 ? (g && w && n.allowThresholdMove && n.currentTranslate > (s.centeredSlides ? r.minTranslate() - r.slidesSizesGrid[r.activeIndex + 1] - ("auto" !== s.slidesPerView && r.slides.length - s.slidesPerView >= 2 ? r.slidesSizesGrid[r.activeIndex + 1] + r.params.spaceBetween : 0) - r.params.spaceBetween : r.minTranslate()) && r.loopFix({
                direction: "prev",
                setTranslate: !0,
                activeSlideIndex: 0
            }),
            n.currentTranslate > r.minTranslate() && (y = !1,
            s.resistance && (n.currentTranslate = r.minTranslate() - 1 + (-r.minTranslate() + n.startTranslate + m) ** b))) : m < 0 && (g && w && n.allowThresholdMove && n.currentTranslate < (s.centeredSlides ? r.maxTranslate() + r.slidesSizesGrid[r.slidesSizesGrid.length - 1] + r.params.spaceBetween + ("auto" !== s.slidesPerView && r.slides.length - s.slidesPerView >= 2 ? r.slidesSizesGrid[r.slidesSizesGrid.length - 1] + r.params.spaceBetween : 0) : r.maxTranslate()) && r.loopFix({
                direction: "next",
                setTranslate: !0,
                activeSlideIndex: r.slides.length - ("auto" === s.slidesPerView ? r.slidesPerViewDynamic() : Math.ceil(parseFloat(s.slidesPerView, 10)))
            }),
            n.currentTranslate < r.maxTranslate() && (y = !1,
            s.resistance && (n.currentTranslate = r.maxTranslate() + 1 - (r.maxTranslate() - n.startTranslate - m) ** b))),
            y && (d.preventedByNestedSwiper = !0),
            !r.allowSlideNext && "next" === r.swipeDirection && n.currentTranslate < n.startTranslate && (n.currentTranslate = n.startTranslate),
            !r.allowSlidePrev && "prev" === r.swipeDirection && n.currentTranslate > n.startTranslate && (n.currentTranslate = n.startTranslate),
            r.allowSlidePrev || r.allowSlideNext || (n.currentTranslate = n.startTranslate),
            s.threshold > 0) {
                if (!(Math.abs(m) > s.threshold || n.allowThresholdMove))
                    return void (n.currentTranslate = n.startTranslate);
                if (!n.allowThresholdMove)
                    return n.allowThresholdMove = !0,
                    i.startX = i.currentX,
                    i.startY = i.currentY,
                    n.currentTranslate = n.startTranslate,
                    void (i.diff = r.isHorizontal() ? i.currentX - i.startX : i.currentY - i.startY)
            }
            s.followFinger && !s.cssMode && ((s.freeMode && s.freeMode.enabled && r.freeMode || s.watchSlidesProgress) && (r.updateActiveIndex(),
            r.updateSlidesClasses()),
            s.freeMode && s.freeMode.enabled && r.freeMode && r.freeMode.onTouchMove(),
            r.updateProgress(n.currentTranslate),
            r.setTranslate(n.currentTranslate))
        }
        function Xe(e) {
            const t = this
              , r = t.touchEventsData;
            let n, s = e;
            s.originalEvent && (s = s.originalEvent);
            if ("touchend" === s.type || "touchcancel" === s.type) {
                if (n = [...s.changedTouches].find((e => e.identifier === r.touchId)),
                !n || n.identifier !== r.touchId)
                    return
            } else {
                if (null !== r.touchId)
                    return;
                if (s.pointerId !== r.pointerId)
                    return;
                n = s
            }
            if (["pointercancel", "pointerout", "pointerleave", "contextmenu"].includes(s.type)) {
                if (!(["pointercancel", "contextmenu"].includes(s.type) && (t.browser.isSafari || t.browser.isWebView)))
                    return
            }
            r.pointerId = null,
            r.touchId = null;
            const {params: i, touches: a, rtlTranslate: o, slidesGrid: l, enabled: d} = t;
            if (!d)
                return;
            if (!i.simulateTouch && "mouse" === s.pointerType)
                return;
            if (r.allowTouchCallbacks && t.emit("touchEnd", s),
            r.allowTouchCallbacks = !1,
            !r.isTouched)
                return r.isMoved && i.grabCursor && t.setGrabCursor(!1),
                r.isMoved = !1,
                void (r.startMoving = !1);
            i.grabCursor && r.isMoved && r.isTouched && (!0 === t.allowSlideNext || !0 === t.allowSlidePrev) && t.setGrabCursor(!1);
            const c = me()
              , u = c - r.touchStartTime;
            if (t.allowClick) {
                const e = s.path || s.composedPath && s.composedPath();
                t.updateClickedSlide(e && e[0] || s.target, e),
                t.emit("tap click", s),
                u < 300 && c - r.lastClickTime < 300 && t.emit("doubleTap doubleClick", s)
            }
            if (r.lastClickTime = me(),
            fe(( () => {
                t.destroyed || (t.allowClick = !0)
            }
            )),
            !r.isTouched || !r.isMoved || !t.swipeDirection || 0 === a.diff && !r.loopSwapReset || r.currentTranslate === r.startTranslate && !r.loopSwapReset)
                return r.isTouched = !1,
                r.isMoved = !1,
                void (r.startMoving = !1);
            let p;
            if (r.isTouched = !1,
            r.isMoved = !1,
            r.startMoving = !1,
            p = i.followFinger ? o ? t.translate : -t.translate : -r.currentTranslate,
            i.cssMode)
                return;
            if (i.freeMode && i.freeMode.enabled)
                return void t.freeMode.onTouchEnd({
                    currentPos: p
                });
            const f = p >= -t.maxTranslate() && !t.params.loop;
            let m = 0
              , h = t.slidesSizesGrid[0];
            for (let e = 0; e < l.length; e += e < i.slidesPerGroupSkip ? 1 : i.slidesPerGroup) {
                const t = e < i.slidesPerGroupSkip - 1 ? 1 : i.slidesPerGroup;
                void 0 !== l[e + t] ? (f || p >= l[e] && p < l[e + t]) && (m = e,
                h = l[e + t] - l[e]) : (f || p >= l[e]) && (m = e,
                h = l[l.length - 1] - l[l.length - 2])
            }
            let v = null
              , g = null;
            i.rewind && (t.isBeginning ? g = i.virtual && i.virtual.enabled && t.virtual ? t.virtual.slides.length - 1 : t.slides.length - 1 : t.isEnd && (v = 0));
            const w = (p - l[m]) / h
              , y = m < i.slidesPerGroupSkip - 1 ? 1 : i.slidesPerGroup;
            if (u > i.longSwipesMs) {
                if (!i.longSwipes)
                    return void t.slideTo(t.activeIndex);
                "next" === t.swipeDirection && (w >= i.longSwipesRatio ? t.slideTo(i.rewind && t.isEnd ? v : m + y) : t.slideTo(m)),
                "prev" === t.swipeDirection && (w > 1 - i.longSwipesRatio ? t.slideTo(m + y) : null !== g && w < 0 && Math.abs(w) > i.longSwipesRatio ? t.slideTo(g) : t.slideTo(m))
            } else {
                if (!i.shortSwipes)
                    return void t.slideTo(t.activeIndex);
                t.navigation && (s.target === t.navigation.nextEl || s.target === t.navigation.prevEl) ? s.target === t.navigation.nextEl ? t.slideTo(m + y) : t.slideTo(m) : ("next" === t.swipeDirection && t.slideTo(null !== v ? v : m + y),
                "prev" === t.swipeDirection && t.slideTo(null !== g ? g : m))
            }
        }
        function Ye() {
            const e = this
              , {params: t, el: r} = e;
            if (r && 0 === r.offsetWidth)
                return;
            t.breakpoints && e.setBreakpoint();
            const {allowSlideNext: n, allowSlidePrev: s, snapGrid: i} = e
              , a = e.virtual && e.params.virtual.enabled;
            e.allowSlideNext = !0,
            e.allowSlidePrev = !0,
            e.updateSize(),
            e.updateSlides(),
            e.updateSlidesClasses();
            const o = a && t.loop;
            !("auto" === t.slidesPerView || t.slidesPerView > 1) || !e.isEnd || e.isBeginning || e.params.centeredSlides || o ? e.params.loop && !a ? e.slideToLoop(e.realIndex, 0, !1, !0) : e.slideTo(e.activeIndex, 0, !1, !0) : e.slideTo(e.slides.length - 1, 0, !1, !0),
            e.autoplay && e.autoplay.running && e.autoplay.paused && (clearTimeout(e.autoplay.resizeTimeout),
            e.autoplay.resizeTimeout = setTimeout(( () => {
                e.autoplay && e.autoplay.running && e.autoplay.paused && e.autoplay.resume()
            }
            ), 500)),
            e.allowSlidePrev = s,
            e.allowSlideNext = n,
            e.params.watchOverflow && i !== e.snapGrid && e.checkOverflow()
        }
        function Ue(e) {
            const t = this;
            t.enabled && (t.allowClick || (t.params.preventClicks && e.preventDefault(),
            t.params.preventClicksPropagation && t.animating && (e.stopPropagation(),
            e.stopImmediatePropagation())))
        }
        function Ke() {
            const e = this
              , {wrapperEl: t, rtlTranslate: r, enabled: n} = e;
            if (!n)
                return;
            let s;
            e.previousTranslate = e.translate,
            e.isHorizontal() ? e.translate = -t.scrollLeft : e.translate = -t.scrollTop,
            0 === e.translate && (e.translate = 0),
            e.updateActiveIndex(),
            e.updateSlidesClasses();
            const i = e.maxTranslate() - e.minTranslate();
            s = 0 === i ? 0 : (e.translate - e.minTranslate()) / i,
            s !== e.progress && e.updateProgress(r ? -e.translate : e.translate),
            e.emit("setTranslate", e.translate, !1)
        }
        function Ze(e) {
            const t = this;
            Ge(t, e.target),
            t.params.cssMode || "auto" !== t.params.slidesPerView && !t.params.autoHeight || t.update()
        }
        function Qe() {
            const e = this;
            e.documentTouchHandlerProceeded || (e.documentTouchHandlerProceeded = !0,
            e.params.touchReleaseOnEdges && (e.el.style.touchAction = "auto"))
        }
        const Je = (e, t) => {
            const r = ce()
              , {params: n, el: s, wrapperEl: i, device: a} = e
              , o = !!n.nested
              , l = "on" === t ? "addEventListener" : "removeEventListener"
              , d = t;
            s && "string" != typeof s && (r[l]("touchstart", e.onDocumentTouchStart, {
                passive: !1,
                capture: o
            }),
            s[l]("touchstart", e.onTouchStart, {
                passive: !1
            }),
            s[l]("pointerdown", e.onTouchStart, {
                passive: !1
            }),
            r[l]("touchmove", e.onTouchMove, {
                passive: !1,
                capture: o
            }),
            r[l]("pointermove", e.onTouchMove, {
                passive: !1,
                capture: o
            }),
            r[l]("touchend", e.onTouchEnd, {
                passive: !0
            }),
            r[l]("pointerup", e.onTouchEnd, {
                passive: !0
            }),
            r[l]("pointercancel", e.onTouchEnd, {
                passive: !0
            }),
            r[l]("touchcancel", e.onTouchEnd, {
                passive: !0
            }),
            r[l]("pointerout", e.onTouchEnd, {
                passive: !0
            }),
            r[l]("pointerleave", e.onTouchEnd, {
                passive: !0
            }),
            r[l]("contextmenu", e.onTouchEnd, {
                passive: !0
            }),
            (n.preventClicks || n.preventClicksPropagation) && s[l]("click", e.onClick, !0),
            n.cssMode && i[l]("scroll", e.onScroll),
            n.updateOnWindowResize ? e[d](a.ios || a.android ? "resize orientationchange observerUpdate" : "resize observerUpdate", Ye, !0) : e[d]("observerUpdate", Ye, !0),
            s[l]("load", e.onLoad, {
                capture: !0
            }))
        }
        ;
        const et = (e, t) => e.grid && t.grid && t.grid.rows > 1;
        var tt = {
            init: !0,
            direction: "horizontal",
            oneWayMovement: !1,
            swiperElementNodeName: "SWIPER-CONTAINER",
            touchEventsTarget: "wrapper",
            initialSlide: 0,
            speed: 300,
            cssMode: !1,
            updateOnWindowResize: !0,
            resizeObserver: !0,
            nested: !1,
            createElements: !1,
            eventsPrefix: "swiper",
            enabled: !0,
            focusableElements: "input, select, option, textarea, button, video, label",
            width: null,
            height: null,
            preventInteractionOnTransition: !1,
            userAgent: null,
            url: null,
            edgeSwipeDetection: !1,
            edgeSwipeThreshold: 20,
            autoHeight: !1,
            setWrapperSize: !1,
            virtualTranslate: !1,
            effect: "slide",
            breakpoints: void 0,
            breakpointsBase: "window",
            spaceBetween: 0,
            slidesPerView: 1,
            slidesPerGroup: 1,
            slidesPerGroupSkip: 0,
            slidesPerGroupAuto: !1,
            centeredSlides: !1,
            centeredSlidesBounds: !1,
            slidesOffsetBefore: 0,
            slidesOffsetAfter: 0,
            normalizeSlideIndex: !0,
            centerInsufficientSlides: !1,
            watchOverflow: !0,
            roundLengths: !1,
            touchRatio: 1,
            touchAngle: 45,
            simulateTouch: !0,
            shortSwipes: !0,
            longSwipes: !0,
            longSwipesRatio: .5,
            longSwipesMs: 300,
            followFinger: !0,
            allowTouchMove: !0,
            threshold: 5,
            touchMoveStopPropagation: !1,
            touchStartPreventDefault: !0,
            touchStartForcePreventDefault: !1,
            touchReleaseOnEdges: !1,
            uniqueNavElements: !0,
            resistance: !0,
            resistanceRatio: .85,
            watchSlidesProgress: !1,
            grabCursor: !1,
            preventClicks: !0,
            preventClicksPropagation: !0,
            slideToClickedSlide: !1,
            loop: !1,
            loopAddBlankSlides: !0,
            loopAdditionalSlides: 0,
            loopPreventsSliding: !0,
            rewind: !1,
            allowSlidePrev: !0,
            allowSlideNext: !0,
            swipeHandler: null,
            noSwiping: !0,
            noSwipingClass: "swiper-no-swiping",
            noSwipingSelector: null,
            passiveListeners: !0,
            maxBackfaceHiddenSlides: 10,
            containerModifierClass: "swiper-",
            slideClass: "swiper-slide",
            slideBlankClass: "swiper-slide-blank",
            slideActiveClass: "swiper-slide-active",
            slideVisibleClass: "swiper-slide-visible",
            slideFullyVisibleClass: "swiper-slide-fully-visible",
            slideNextClass: "swiper-slide-next",
            slidePrevClass: "swiper-slide-prev",
            wrapperClass: "swiper-wrapper",
            lazyPreloaderClass: "swiper-lazy-preloader",
            lazyPreloadPrevNext: 0,
            runCallbacksOnInit: !0,
            _emitClasses: !1
        };
        function rt(e, t) {
            return function(r) {
                void 0 === r && (r = {});
                const n = Object.keys(r)[0]
                  , s = r[n];
                "object" == typeof s && null !== s ? (!0 === e[n] && (e[n] = {
                    enabled: !0
                }),
                "navigation" === n && e[n] && e[n].enabled && !e[n].prevEl && !e[n].nextEl && (e[n].auto = !0),
                ["pagination", "scrollbar"].indexOf(n) >= 0 && e[n] && e[n].enabled && !e[n].el && (e[n].auto = !0),
                n in e && "enabled"in s ? ("object" != typeof e[n] || "enabled"in e[n] || (e[n].enabled = !0),
                e[n] || (e[n] = {
                    enabled: !1
                }),
                ge(t, r)) : ge(t, r)) : ge(t, r)
            }
        }
        const nt = {
            eventsEmitter: ze,
            update: Ne,
            translate: _e,
            transition: {
                setTransition: function(e, t) {
                    const r = this;
                    r.params.cssMode || (r.wrapperEl.style.transitionDuration = `${e}ms`,
                    r.wrapperEl.style.transitionDelay = 0 === e ? "0ms" : ""),
                    r.emit("setTransition", e, t)
                },
                transitionStart: function(e, t) {
                    void 0 === e && (e = !0);
                    const r = this
                      , {params: n} = r;
                    n.cssMode || (n.autoHeight && r.updateAutoHeight(),
                    Fe({
                        swiper: r,
                        runCallbacks: e,
                        direction: t,
                        step: "Start"
                    }))
                },
                transitionEnd: function(e, t) {
                    void 0 === e && (e = !0);
                    const r = this
                      , {params: n} = r;
                    r.animating = !1,
                    n.cssMode || (r.setTransition(0),
                    Fe({
                        swiper: r,
                        runCallbacks: e,
                        direction: t,
                        step: "End"
                    }))
                }
            },
            slide: Ve,
            loop: $e,
            grabCursor: {
                setGrabCursor: function(e) {
                    const t = this;
                    if (!t.params.simulateTouch || t.params.watchOverflow && t.isLocked || t.params.cssMode)
                        return;
                    const r = "container" === t.params.touchEventsTarget ? t.el : t.wrapperEl;
                    t.isElement && (t.__preventObserver__ = !0),
                    r.style.cursor = "move",
                    r.style.cursor = e ? "grabbing" : "grab",
                    t.isElement && requestAnimationFrame(( () => {
                        t.__preventObserver__ = !1
                    }
                    ))
                },
                unsetGrabCursor: function() {
                    const e = this;
                    e.params.watchOverflow && e.isLocked || e.params.cssMode || (e.isElement && (e.__preventObserver__ = !0),
                    e["container" === e.params.touchEventsTarget ? "el" : "wrapperEl"].style.cursor = "",
                    e.isElement && requestAnimationFrame(( () => {
                        e.__preventObserver__ = !1
                    }
                    )))
                }
            },
            events: {
                attachEvents: function() {
                    const e = this
                      , {params: t} = e;
                    e.onTouchStart = je.bind(e),
                    e.onTouchMove = We.bind(e),
                    e.onTouchEnd = Xe.bind(e),
                    e.onDocumentTouchStart = Qe.bind(e),
                    t.cssMode && (e.onScroll = Ke.bind(e)),
                    e.onClick = Ue.bind(e),
                    e.onLoad = Ze.bind(e),
                    Je(e, "on")
                },
                detachEvents: function() {
                    Je(this, "off")
                }
            },
            breakpoints: {
                setBreakpoint: function() {
                    const e = this
                      , {realIndex: t, initialized: r, params: n, el: s} = e
                      , i = n.breakpoints;
                    if (!i || i && 0 === Object.keys(i).length)
                        return;
                    const a = ce()
                      , o = "window" !== n.breakpointsBase && n.breakpointsBase ? "container" : n.breakpointsBase
                      , l = ["window", "container"].includes(n.breakpointsBase) || !n.breakpointsBase ? e.el : a.querySelector(n.breakpointsBase)
                      , d = e.getBreakpoint(i, o, l);
                    if (!d || e.currentBreakpoint === d)
                        return;
                    const c = (d in i ? i[d] : void 0) || e.originalParams
                      , u = et(e, n)
                      , p = et(e, c)
                      , f = e.params.grabCursor
                      , m = c.grabCursor
                      , h = n.enabled;
                    u && !p ? (s.classList.remove(`${n.containerModifierClass}grid`, `${n.containerModifierClass}grid-column`),
                    e.emitContainerClasses()) : !u && p && (s.classList.add(`${n.containerModifierClass}grid`),
                    (c.grid.fill && "column" === c.grid.fill || !c.grid.fill && "column" === n.grid.fill) && s.classList.add(`${n.containerModifierClass}grid-column`),
                    e.emitContainerClasses()),
                    f && !m ? e.unsetGrabCursor() : !f && m && e.setGrabCursor(),
                    ["navigation", "pagination", "scrollbar"].forEach((t => {
                        if (void 0 === c[t])
                            return;
                        const r = n[t] && n[t].enabled
                          , s = c[t] && c[t].enabled;
                        r && !s && e[t].disable(),
                        !r && s && e[t].enable()
                    }
                    ));
                    const v = c.direction && c.direction !== n.direction
                      , g = n.loop && (c.slidesPerView !== n.slidesPerView || v)
                      , w = n.loop;
                    v && r && e.changeDirection(),
                    ge(e.params, c);
                    const y = e.params.enabled
                      , b = e.params.loop;
                    Object.assign(e, {
                        allowTouchMove: e.params.allowTouchMove,
                        allowSlideNext: e.params.allowSlideNext,
                        allowSlidePrev: e.params.allowSlidePrev
                    }),
                    h && !y ? e.disable() : !h && y && e.enable(),
                    e.currentBreakpoint = d,
                    e.emit("_beforeBreakpoint", c),
                    r && (g ? (e.loopDestroy(),
                    e.loopCreate(t),
                    e.updateSlides()) : !w && b ? (e.loopCreate(t),
                    e.updateSlides()) : w && !b && e.loopDestroy()),
                    e.emit("breakpoint", c)
                },
                getBreakpoint: function(e, t, r) {
                    if (void 0 === t && (t = "window"),
                    !e || "container" === t && !r)
                        return;
                    let n = !1;
                    const s = pe()
                      , i = "window" === t ? s.innerHeight : r.clientHeight
                      , a = Object.keys(e).map((e => {
                        if ("string" == typeof e && 0 === e.indexOf("@")) {
                            const t = parseFloat(e.substr(1));
                            return {
                                value: i * t,
                                point: e
                            }
                        }
                        return {
                            value: e,
                            point: e
                        }
                    }
                    ));
                    a.sort(( (e, t) => parseInt(e.value, 10) - parseInt(t.value, 10)));
                    for (let e = 0; e < a.length; e += 1) {
                        const {point: i, value: o} = a[e];
                        "window" === t ? s.matchMedia(`(min-width: ${o}px)`).matches && (n = i) : o <= r.clientWidth && (n = i)
                    }
                    return n || "max"
                }
            },
            checkOverflow: {
                checkOverflow: function() {
                    const e = this
                      , {isLocked: t, params: r} = e
                      , {slidesOffsetBefore: n} = r;
                    if (n) {
                        const t = e.slides.length - 1
                          , r = e.slidesGrid[t] + e.slidesSizesGrid[t] + 2 * n;
                        e.isLocked = e.size > r
                    } else
                        e.isLocked = 1 === e.snapGrid.length;
                    !0 === r.allowSlideNext && (e.allowSlideNext = !e.isLocked),
                    !0 === r.allowSlidePrev && (e.allowSlidePrev = !e.isLocked),
                    t && t !== e.isLocked && (e.isEnd = !1),
                    t !== e.isLocked && e.emit(e.isLocked ? "lock" : "unlock")
                }
            },
            classes: {
                addClasses: function() {
                    const e = this
                      , {classNames: t, params: r, rtl: n, el: s, device: i} = e
                      , a = function(e, t) {
                        const r = [];
                        return e.forEach((e => {
                            "object" == typeof e ? Object.keys(e).forEach((n => {
                                e[n] && r.push(t + n)
                            }
                            )) : "string" == typeof e && r.push(t + e)
                        }
                        )),
                        r
                    }(["initialized", r.direction, {
                        "free-mode": e.params.freeMode && r.freeMode.enabled
                    }, {
                        autoheight: r.autoHeight
                    }, {
                        rtl: n
                    }, {
                        grid: r.grid && r.grid.rows > 1
                    }, {
                        "grid-column": r.grid && r.grid.rows > 1 && "column" === r.grid.fill
                    }, {
                        android: i.android
                    }, {
                        ios: i.ios
                    }, {
                        "css-mode": r.cssMode
                    }, {
                        centered: r.cssMode && r.centeredSlides
                    }, {
                        "watch-progress": r.watchSlidesProgress
                    }], r.containerModifierClass);
                    t.push(...a),
                    s.classList.add(...t),
                    e.emitContainerClasses()
                },
                removeClasses: function() {
                    const {el: e, classNames: t} = this;
                    e && "string" != typeof e && (e.classList.remove(...t),
                    this.emitContainerClasses())
                }
            }
        }
          , st = {};
        class it {
            constructor() {
                let e, t;
                for (var r = arguments.length, n = new Array(r), s = 0; s < r; s++)
                    n[s] = arguments[s];
                1 === n.length && n[0].constructor && "Object" === Object.prototype.toString.call(n[0]).slice(8, -1) ? t = n[0] : [e,t] = n,
                t || (t = {}),
                t = ge({}, t),
                e && !t.el && (t.el = e);
                const i = ce();
                if (t.el && "string" == typeof t.el && i.querySelectorAll(t.el).length > 1) {
                    const e = [];
                    return i.querySelectorAll(t.el).forEach((r => {
                        const n = ge({}, t, {
                            el: r
                        });
                        e.push(new it(n))
                    }
                    )),
                    e
                }
                const a = this;
                a.__swiper__ = !0,
                a.support = Ie(),
                a.device = Oe({
                    userAgent: t.userAgent
                }),
                a.browser = Ae(),
                a.eventsListeners = {},
                a.eventsAnyListeners = [],
                a.modules = [...a.__modules__],
                t.modules && Array.isArray(t.modules) && a.modules.push(...t.modules);
                const o = {};
                a.modules.forEach((e => {
                    e({
                        params: t,
                        swiper: a,
                        extendParams: rt(t, o),
                        on: a.on.bind(a),
                        once: a.once.bind(a),
                        off: a.off.bind(a),
                        emit: a.emit.bind(a)
                    })
                }
                ));
                const l = ge({}, tt, o);
                return a.params = ge({}, l, st, t),
                a.originalParams = ge({}, a.params),
                a.passedParams = ge({}, t),
                a.params && a.params.on && Object.keys(a.params.on).forEach((e => {
                    a.on(e, a.params.on[e])
                }
                )),
                a.params && a.params.onAny && a.onAny(a.params.onAny),
                Object.assign(a, {
                    enabled: a.params.enabled,
                    el: e,
                    classNames: [],
                    slides: [],
                    slidesGrid: [],
                    snapGrid: [],
                    slidesSizesGrid: [],
                    isHorizontal: () => "horizontal" === a.params.direction,
                    isVertical: () => "vertical" === a.params.direction,
                    activeIndex: 0,
                    realIndex: 0,
                    isBeginning: !0,
                    isEnd: !1,
                    translate: 0,
                    previousTranslate: 0,
                    progress: 0,
                    velocity: 0,
                    animating: !1,
                    cssOverflowAdjustment() {
                        return Math.trunc(this.translate / 2 ** 23) * 2 ** 23
                    },
                    allowSlideNext: a.params.allowSlideNext,
                    allowSlidePrev: a.params.allowSlidePrev,
                    touchEventsData: {
                        isTouched: void 0,
                        isMoved: void 0,
                        allowTouchCallbacks: void 0,
                        touchStartTime: void 0,
                        isScrolling: void 0,
                        currentTranslate: void 0,
                        startTranslate: void 0,
                        allowThresholdMove: void 0,
                        focusableElements: a.params.focusableElements,
                        lastClickTime: 0,
                        clickTimeout: void 0,
                        velocities: [],
                        allowMomentumBounce: void 0,
                        startMoving: void 0,
                        pointerId: null,
                        touchId: null
                    },
                    allowClick: !0,
                    allowTouchMove: a.params.allowTouchMove,
                    touches: {
                        startX: 0,
                        startY: 0,
                        currentX: 0,
                        currentY: 0,
                        diff: 0
                    },
                    imagesToLoad: [],
                    imagesLoaded: 0
                }),
                a.emit("_swiper"),
                a.params.init && a.init(),
                a
            }
            getDirectionLabel(e) {
                return this.isHorizontal() ? e : {
                    width: "height",
                    "margin-top": "margin-left",
                    "margin-bottom ": "margin-right",
                    "margin-left": "margin-top",
                    "margin-right": "margin-bottom",
                    "padding-left": "padding-top",
                    "padding-right": "padding-bottom",
                    marginRight: "marginBottom"
                }[e]
            }
            getSlideIndex(e) {
                const {slidesEl: t, params: r} = this
                  , n = Me(Se(t, `.${r.slideClass}, swiper-slide`)[0]);
                return Me(e) - n
            }
            getSlideIndexByData(e) {
                return this.getSlideIndex(this.slides.find((t => 1 * t.getAttribute("data-swiper-slide-index") === e)))
            }
            recalcSlides() {
                const {slidesEl: e, params: t} = this;
                this.slides = Se(e, `.${t.slideClass}, swiper-slide`)
            }
            enable() {
                const e = this;
                e.enabled || (e.enabled = !0,
                e.params.grabCursor && e.setGrabCursor(),
                e.emit("enable"))
            }
            disable() {
                const e = this;
                e.enabled && (e.enabled = !1,
                e.params.grabCursor && e.unsetGrabCursor(),
                e.emit("disable"))
            }
            setProgress(e, t) {
                const r = this;
                e = Math.min(Math.max(e, 0), 1);
                const n = r.minTranslate()
                  , s = (r.maxTranslate() - n) * e + n;
                r.translateTo(s, void 0 === t ? 0 : t),
                r.updateActiveIndex(),
                r.updateSlidesClasses()
            }
            emitContainerClasses() {
                const e = this;
                if (!e.params._emitClasses || !e.el)
                    return;
                const t = e.el.className.split(" ").filter((t => 0 === t.indexOf("swiper") || 0 === t.indexOf(e.params.containerModifierClass)));
                e.emit("_containerClasses", t.join(" "))
            }
            getSlideClasses(e) {
                const t = this;
                return t.destroyed ? "" : e.className.split(" ").filter((e => 0 === e.indexOf("swiper-slide") || 0 === e.indexOf(t.params.slideClass))).join(" ")
            }
            emitSlidesClasses() {
                const e = this;
                if (!e.params._emitClasses || !e.el)
                    return;
                const t = [];
                e.slides.forEach((r => {
                    const n = e.getSlideClasses(r);
                    t.push({
                        slideEl: r,
                        classNames: n
                    }),
                    e.emit("_slideClass", r, n)
                }
                )),
                e.emit("_slideClasses", t)
            }
            slidesPerViewDynamic(e, t) {
                void 0 === e && (e = "current"),
                void 0 === t && (t = !1);
                const {params: r, slides: n, slidesGrid: s, slidesSizesGrid: i, size: a, activeIndex: o} = this;
                let l = 1;
                if ("number" == typeof r.slidesPerView)
                    return r.slidesPerView;
                if (r.centeredSlides) {
                    let e, t = n[o] ? Math.ceil(n[o].swiperSlideSize) : 0;
                    for (let r = o + 1; r < n.length; r += 1)
                        n[r] && !e && (t += Math.ceil(n[r].swiperSlideSize),
                        l += 1,
                        t > a && (e = !0));
                    for (let r = o - 1; r >= 0; r -= 1)
                        n[r] && !e && (t += n[r].swiperSlideSize,
                        l += 1,
                        t > a && (e = !0))
                } else if ("current" === e)
                    for (let e = o + 1; e < n.length; e += 1) {
                        (t ? s[e] + i[e] - s[o] < a : s[e] - s[o] < a) && (l += 1)
                    }
                else
                    for (let e = o - 1; e >= 0; e -= 1) {
                        s[o] - s[e] < a && (l += 1)
                    }
                return l
            }
            update() {
                const e = this;
                if (!e || e.destroyed)
                    return;
                const {snapGrid: t, params: r} = e;
                function n() {
                    const t = e.rtlTranslate ? -1 * e.translate : e.translate
                      , r = Math.min(Math.max(t, e.maxTranslate()), e.minTranslate());
                    e.setTranslate(r),
                    e.updateActiveIndex(),
                    e.updateSlidesClasses()
                }
                let s;
                if (r.breakpoints && e.setBreakpoint(),
                [...e.el.querySelectorAll('[loading="lazy"]')].forEach((t => {
                    t.complete && Ge(e, t)
                }
                )),
                e.updateSize(),
                e.updateSlides(),
                e.updateProgress(),
                e.updateSlidesClasses(),
                r.freeMode && r.freeMode.enabled && !r.cssMode)
                    n(),
                    r.autoHeight && e.updateAutoHeight();
                else {
                    if (("auto" === r.slidesPerView || r.slidesPerView > 1) && e.isEnd && !r.centeredSlides) {
                        const t = e.virtual && r.virtual.enabled ? e.virtual.slides : e.slides;
                        s = e.slideTo(t.length - 1, 0, !1, !0)
                    } else
                        s = e.slideTo(e.activeIndex, 0, !1, !0);
                    s || n()
                }
                r.watchOverflow && t !== e.snapGrid && e.checkOverflow(),
                e.emit("update")
            }
            changeDirection(e, t) {
                void 0 === t && (t = !0);
                const r = this
                  , n = r.params.direction;
                return e || (e = "horizontal" === n ? "vertical" : "horizontal"),
                e === n || "horizontal" !== e && "vertical" !== e || (r.el.classList.remove(`${r.params.containerModifierClass}${n}`),
                r.el.classList.add(`${r.params.containerModifierClass}${e}`),
                r.emitContainerClasses(),
                r.params.direction = e,
                r.slides.forEach((t => {
                    "vertical" === e ? t.style.width = "" : t.style.height = ""
                }
                )),
                r.emit("changeDirection"),
                t && r.update()),
                r
            }
            changeLanguageDirection(e) {
                const t = this;
                t.rtl && "rtl" === e || !t.rtl && "ltr" === e || (t.rtl = "rtl" === e,
                t.rtlTranslate = "horizontal" === t.params.direction && t.rtl,
                t.rtl ? (t.el.classList.add(`${t.params.containerModifierClass}rtl`),
                t.el.dir = "rtl") : (t.el.classList.remove(`${t.params.containerModifierClass}rtl`),
                t.el.dir = "ltr"),
                t.update())
            }
            mount(e) {
                const t = this;
                if (t.mounted)
                    return !0;
                let r = e || t.params.el;
                if ("string" == typeof r && (r = document.querySelector(r)),
                !r)
                    return !1;
                r.swiper = t,
                r.parentNode && r.parentNode.host && r.parentNode.host.nodeName === t.params.swiperElementNodeName.toUpperCase() && (t.isElement = !0);
                const n = () => `.${(t.params.wrapperClass || "").trim().split(" ").join(".")}`;
                let s = ( () => {
                    if (r && r.shadowRoot && r.shadowRoot.querySelector) {
                        return r.shadowRoot.querySelector(n())
                    }
                    return Se(r, n())[0]
                }
                )();
                return !s && t.params.createElements && (s = xe("div", t.params.wrapperClass),
                r.append(s),
                Se(r, `.${t.params.slideClass}`).forEach((e => {
                    s.append(e)
                }
                ))),
                Object.assign(t, {
                    el: r,
                    wrapperEl: s,
                    slidesEl: t.isElement && !r.parentNode.host.slideSlots ? r.parentNode.host : s,
                    hostEl: t.isElement ? r.parentNode.host : r,
                    mounted: !0,
                    rtl: "rtl" === r.dir.toLowerCase() || "rtl" === Ee(r, "direction"),
                    rtlTranslate: "horizontal" === t.params.direction && ("rtl" === r.dir.toLowerCase() || "rtl" === Ee(r, "direction")),
                    wrongRTL: "-webkit-box" === Ee(s, "display")
                }),
                !0
            }
            init(e) {
                const t = this;
                if (t.initialized)
                    return t;
                if (!1 === t.mount(e))
                    return t;
                t.emit("beforeInit"),
                t.params.breakpoints && t.setBreakpoint(),
                t.addClasses(),
                t.updateSize(),
                t.updateSlides(),
                t.params.watchOverflow && t.checkOverflow(),
                t.params.grabCursor && t.enabled && t.setGrabCursor(),
                t.params.loop && t.virtual && t.params.virtual.enabled ? t.slideTo(t.params.initialSlide + t.virtual.slidesBefore, 0, t.params.runCallbacksOnInit, !1, !0) : t.slideTo(t.params.initialSlide, 0, t.params.runCallbacksOnInit, !1, !0),
                t.params.loop && t.loopCreate(),
                t.attachEvents();
                const r = [...t.el.querySelectorAll('[loading="lazy"]')];
                return t.isElement && r.push(...t.hostEl.querySelectorAll('[loading="lazy"]')),
                r.forEach((e => {
                    e.complete ? Ge(t, e) : e.addEventListener("load", (e => {
                        Ge(t, e.target)
                    }
                    ))
                }
                )),
                Be(t),
                t.initialized = !0,
                Be(t),
                t.emit("init"),
                t.emit("afterInit"),
                t
            }
            destroy(e, t) {
                void 0 === e && (e = !0),
                void 0 === t && (t = !0);
                const r = this
                  , {params: n, el: s, wrapperEl: i, slides: a} = r;
                return void 0 === r.params || r.destroyed || (r.emit("beforeDestroy"),
                r.initialized = !1,
                r.detachEvents(),
                n.loop && r.loopDestroy(),
                t && (r.removeClasses(),
                s && "string" != typeof s && s.removeAttribute("style"),
                i && i.removeAttribute("style"),
                a && a.length && a.forEach((e => {
                    e.classList.remove(n.slideVisibleClass, n.slideFullyVisibleClass, n.slideActiveClass, n.slideNextClass, n.slidePrevClass),
                    e.removeAttribute("style"),
                    e.removeAttribute("data-swiper-slide-index")
                }
                ))),
                r.emit("destroy"),
                Object.keys(r.eventsListeners).forEach((e => {
                    r.off(e)
                }
                )),
                !1 !== e && (r.el && "string" != typeof r.el && (r.el.swiper = null),
                function(e) {
                    const t = e;
                    Object.keys(t).forEach((e => {
                        try {
                            t[e] = null
                        } catch (e) {}
                        try {
                            delete t[e]
                        } catch (e) {}
                    }
                    ))
                }(r)),
                r.destroyed = !0),
                null
            }
            static extendDefaults(e) {
                ge(st, e)
            }
            static get extendedDefaults() {
                return st
            }
            static get defaults() {
                return tt
            }
            static installModule(e) {
                it.prototype.__modules__ || (it.prototype.__modules__ = []);
                const t = it.prototype.__modules__;
                "function" == typeof e && t.indexOf(e) < 0 && t.push(e)
            }
            static use(e) {
                return Array.isArray(e) ? (e.forEach((e => it.installModule(e))),
                it) : (it.installModule(e),
                it)
            }
        }
        function at(e, t) {
            const r = be(t);
            return r !== t && (r.style.backfaceVisibility = "hidden",
            r.style["-webkit-backface-visibility"] = "hidden"),
            r
        }
        function ot(e, t, r) {
            const n = `swiper-slide-shadow${r ? `-${r}` : ""}${e ? ` swiper-slide-shadow-${e}` : ""}`
              , s = be(t);
            let i = s.querySelector(`.${n.split(" ").join(".")}`);
            return i || (i = xe("div", n.split(" ")),
            s.append(i)),
            i
        }
        function lt(e) {
            let {swiper: t, extendParams: r, on: n} = e;
            r({
                coverflowEffect: {
                    rotate: 50,
                    stretch: 0,
                    depth: 100,
                    scale: 1,
                    modifier: 1,
                    slideShadows: !0
                }
            });
            !function(e) {
                const {effect: t, swiper: r, on: n, setTranslate: s, setTransition: i, overwriteParams: a, perspective: o, recreateShadows: l, getEffectParams: d} = e;
                let c;
                n("beforeInit", ( () => {
                    if (r.params.effect !== t)
                        return;
                    r.classNames.push(`${r.params.containerModifierClass}${t}`),
                    o && o() && r.classNames.push(`${r.params.containerModifierClass}3d`);
                    const e = a ? a() : {};
                    Object.assign(r.params, e),
                    Object.assign(r.originalParams, e)
                }
                )),
                n("setTranslate", ( () => {
                    r.params.effect === t && s()
                }
                )),
                n("setTransition", ( (e, n) => {
                    r.params.effect === t && i(n)
                }
                )),
                n("transitionEnd", ( () => {
                    if (r.params.effect === t && l) {
                        if (!d || !d().slideShadows)
                            return;
                        r.slides.forEach((e => {
                            e.querySelectorAll(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").forEach((e => e.remove()))
                        }
                        )),
                        l()
                    }
                }
                )),
                n("virtualUpdate", ( () => {
                    r.params.effect === t && (r.slides.length || (c = !0),
                    requestAnimationFrame(( () => {
                        c && r.slides && r.slides.length && (s(),
                        c = !1)
                    }
                    )))
                }
                ))
            }({
                effect: "coverflow",
                swiper: t,
                on: n,
                setTranslate: () => {
                    const {width: e, height: r, slides: n, slidesSizesGrid: s} = t
                      , i = t.params.coverflowEffect
                      , a = t.isHorizontal()
                      , o = t.translate
                      , l = a ? e / 2 - o : r / 2 - o
                      , d = a ? i.rotate : -i.rotate
                      , c = i.depth
                      , u = function(e) {
                        return t => Math.abs(t) > 0 && e.browser && e.browser.need3dFix && Math.abs(t) % 90 == 0 ? t + .001 : t
                    }(t);
                    for (let e = 0, t = n.length; e < t; e += 1) {
                        const t = n[e]
                          , r = s[e]
                          , o = (l - t.swiperSlideOffset - r / 2) / r
                          , p = "function" == typeof i.modifier ? i.modifier(o) : o * i.modifier;
                        let f = a ? d * p : 0
                          , m = a ? 0 : d * p
                          , h = -c * Math.abs(p)
                          , v = i.stretch;
                        "string" == typeof v && -1 !== v.indexOf("%") && (v = parseFloat(i.stretch) / 100 * r);
                        let g = a ? 0 : v * p
                          , w = a ? v * p : 0
                          , y = 1 - (1 - i.scale) * Math.abs(p);
                        Math.abs(w) < .001 && (w = 0),
                        Math.abs(g) < .001 && (g = 0),
                        Math.abs(h) < .001 && (h = 0),
                        Math.abs(f) < .001 && (f = 0),
                        Math.abs(m) < .001 && (m = 0),
                        Math.abs(y) < .001 && (y = 0);
                        const b = `translate3d(${w}px,${g}px,${h}px)  rotateX(${u(m)}deg) rotateY(${u(f)}deg) scale(${y})`;
                        if (at(0, t).style.transform = b,
                        t.style.zIndex = 1 - Math.abs(Math.round(p)),
                        i.slideShadows) {
                            let e = a ? t.querySelector(".swiper-slide-shadow-left") : t.querySelector(".swiper-slide-shadow-top")
                              , r = a ? t.querySelector(".swiper-slide-shadow-right") : t.querySelector(".swiper-slide-shadow-bottom");
                            e || (e = ot("coverflow", t, a ? "left" : "top")),
                            r || (r = ot("coverflow", t, a ? "right" : "bottom")),
                            e && (e.style.opacity = p > 0 ? p : 0),
                            r && (r.style.opacity = -p > 0 ? -p : 0)
                        }
                    }
                }
                ,
                setTransition: e => {
                    t.slides.map((e => be(e))).forEach((t => {
                        t.style.transitionDuration = `${e}ms`,
                        t.querySelectorAll(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").forEach((t => {
                            t.style.transitionDuration = `${e}ms`
                        }
                        ))
                    }
                    ))
                }
                ,
                perspective: () => !0,
                overwriteParams: () => ({
                    watchSlidesProgress: !0
                })
            })
        }
        Object.keys(nt).forEach((e => {
            Object.keys(nt[e]).forEach((t => {
                it.prototype[t] = nt[e][t]
            }
            ))
        }
        )),
        it.use([function(e) {
            let {swiper: t, on: r, emit: n} = e;
            const s = pe();
            let i = null
              , a = null;
            const o = () => {
                t && !t.destroyed && t.initialized && (n("beforeResize"),
                n("resize"))
            }
              , l = () => {
                t && !t.destroyed && t.initialized && n("orientationchange")
            }
            ;
            r("init", ( () => {
                t.params.resizeObserver && void 0 !== s.ResizeObserver ? t && !t.destroyed && t.initialized && (i = new ResizeObserver((e => {
                    a = s.requestAnimationFrame(( () => {
                        const {width: r, height: n} = t;
                        let s = r
                          , i = n;
                        e.forEach((e => {
                            let {contentBoxSize: r, contentRect: n, target: a} = e;
                            a && a !== t.el || (s = n ? n.width : (r[0] || r).inlineSize,
                            i = n ? n.height : (r[0] || r).blockSize)
                        }
                        )),
                        s === r && i === n || o()
                    }
                    ))
                }
                )),
                i.observe(t.el)) : (s.addEventListener("resize", o),
                s.addEventListener("orientationchange", l))
            }
            )),
            r("destroy", ( () => {
                a && s.cancelAnimationFrame(a),
                i && i.unobserve && t.el && (i.unobserve(t.el),
                i = null),
                s.removeEventListener("resize", o),
                s.removeEventListener("orientationchange", l)
            }
            ))
        }
        , function(e) {
            let {swiper: t, extendParams: r, on: n, emit: s} = e;
            const i = []
              , a = pe()
              , o = function(e, r) {
                void 0 === r && (r = {});
                const n = new (a.MutationObserver || a.WebkitMutationObserver)((e => {
                    if (t.__preventObserver__)
                        return;
                    if (1 === e.length)
                        return void s("observerUpdate", e[0]);
                    const r = function() {
                        s("observerUpdate", e[0])
                    };
                    a.requestAnimationFrame ? a.requestAnimationFrame(r) : a.setTimeout(r, 0)
                }
                ));
                n.observe(e, {
                    attributes: void 0 === r.attributes || r.attributes,
                    childList: t.isElement || (void 0 === r.childList || r).childList,
                    characterData: void 0 === r.characterData || r.characterData
                }),
                i.push(n)
            };
            r({
                observer: !1,
                observeParents: !1,
                observeSlideChildren: !1
            }),
            n("init", ( () => {
                if (t.params.observer) {
                    if (t.params.observeParents) {
                        const e = function(e, t) {
                            const r = [];
                            let n = e.parentElement;
                            for (; n; )
                                t ? n.matches(t) && r.push(n) : r.push(n),
                                n = n.parentElement;
                            return r
                        }(t.hostEl);
                        for (let t = 0; t < e.length; t += 1)
                            o(e[t])
                    }
                    o(t.hostEl, {
                        childList: t.params.observeSlideChildren
                    }),
                    o(t.wrapperEl, {
                        attributes: !1
                    })
                }
            }
            )),
            n("destroy", ( () => {
                i.forEach((e => {
                    e.disconnect()
                }
                )),
                i.splice(0, i.length)
            }
            ))
        }
        ]),
        document.addEventListener("DOMContentLoaded", (function() {
            var e = {
                modules: [lt],
                effect: "coverflow",
                grabCursor: !0,
                speed: 400,
                slideToClickedSlide: !0,
                initialSlide: 1,
                centeredSlides: !0,
                slidesPerView: "auto",
                coverflowEffect: {
                    rotate: 20,
                    stretch: 0,
                    depth: 350,
                    modifier: 1,
                    slideShadows: !0
                },
                on: {
                    init: function() {
                        this.el.querySelectorAll("img").forEach((function(e) {
                            e.removeAttribute("loading")
                        }
                        ))
                    }
                }
            };
            function t() {
                document.querySelectorAll(".swiper-container").forEach((function(e) {
                    window.innerWidth < 1025 && window.innerHeight > window.innerWidth ? e.closest(".page").querySelector(".right-pane").appendChild(e) : e.closest(".page").appendChild(e)
                }
                ))
            }
            [{
                container: ".swiper-container.credentials"
            }, {
                container: ".swiper-container.figma"
            }, {
                container: ".swiper-container.inspirations"
            }, {
                container: ".swiper-container.systems"
            }].forEach((function(t) {
                var r = document.querySelector(t.container);
                if (r) {
                    var n = r.closest(".page");
                    if (n) {
                        var s = new it(t.container,e)
                          , i = Math.floor(s.slides.length / 2);
                        setTimeout((function() {
                            return s.slideTo(i)
                        }
                        ), 300),
                        s.on("slideChange", (function(e) {
                            return function(e, t) {
                                var r = e.slides[e.activeIndex];
                                t.querySelectorAll(".info-box").forEach((function(e) {
                                    e.classList.toggle("active", e.dataset.slide === r.dataset.slide)
                                }
                                ))
                            }(e, n)
                        }
                        ))
                    }
                }
            }
            )),
            t(),
            window.addEventListener("resize", (function() {
                t()
            }
            ))
        }
        ));
        r(137),
        r(492),
        r(967),
        r(834),
        r(319)
    }
    )()
}
)();
