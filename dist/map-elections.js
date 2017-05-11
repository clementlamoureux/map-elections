var MapElections;
(function (MapElections) {
    var labels = [
        "Nombre d'inscrits",
        "Nombre de votants",
        "% Participation",
        "Nuls",
        "Blancs",
        "Total exprimés",
        "Pourcentage de suffrages exprimés",
        "M. Nicolas DUPONT-AIGNAN",
        "Total M. Nicolas DUPONT-AIGNAN",
        "Mme Marine LE PEN",
        "Total Mme Marine LE PEN",
        "M. Emmanuel MACRON",
        "Total M. Emmanuel MACRON",
        "M. Benoît HAMON",
        "Total  M. Benoît HAMON",
        "Mme Nathalie ARTHAUD",
        "Total Mme Nathalie ARTHAUD",
        "M. Philippe POUTOU",
        "Total M. Philippe POUTOU",
        "M. Jacques CHEMINADE",
        "Total  M. Jacques CHEMINADE",
        "M. Jean LASSALLE",
        "Total  M. Jean LASSALLE ",
        "M. Jean-Luc MÉLENCHON",
        "Total  M. Jean-Luc MÉLENCHON",
        "M. François ASSELINEAU",
        "Total  M. François ASSELINEAU",
        "M. François FILLON",
        "Total  M. François FILLON"
    ];
    var Http = (function () {
        function Http() {
        }
        Http.prototype.get = function (url, callback, error) {
            var req = new XMLHttpRequest();
            req.onreadystatechange = function () {
                if (req.readyState === XMLHttpRequest.DONE) {
                    if (req.status === 200) {
                        if (typeof callback === 'function') {
                            callback(JSON.parse(req.responseText));
                        }
                    }
                    else {
                        if (typeof error === 'function') {
                            error(req.status, req.statusText);
                        }
                    }
                }
            };
            req.open('GET', url, true);
            req.send(null);
        };
        return Http;
    }());
    var Loader = (function () {
        function Loader() {
        }
        Loader.update = function (value, total) {
            setTimeout(function () {
                var percent = ((value / (total - 1)) * 100).toFixed();
                document.querySelector('.progress').innerHTML = percent + '%';
                if (percent === '100') {
                    document.querySelector('.progress').innerHTML = percent + '%';
                    setTimeout(function () {
                        if (document.querySelector('.loading-box')) {
                            document.querySelector('.loading-box').parentNode.removeChild(document.querySelector('.loading-box'));
                        }
                    }, 300);
                }
            }, 300);
        };
        return Loader;
    }());
    var Main = (function () {
        function Main() {
            var req = new Http();
            req.get('data/data.json', function (data) {
                data.forEach(function (point, pointKey) {
                    var marker = new RichMarker({
                        position: new google.maps.LatLng(point.lat, point.lng),
                        map: map,
                        anchor: RichMarkerPosition.BOTTOM,
                        content: '<div class="my-marker"><div class="pin" style="background: ' + Util.getRandomColor() + '"></div></div>'
                    });
                    marker.addListener('click', function () {
                        if (!Main.iw) {
                            Main.iw = new InfoWindow();
                        }
                        map.panTo(marker.getPosition());
                        Main.iw.open(point);
                    });
                    map.addListener('bounds_changed', function () {
                        if (Main.iw) {
                            Main.iw.close();
                        }
                    });
                    document.getElementById('map').style.opacity = "1";
                    Loader.update(pointKey, data.length);
                });
            });
        }
        return Main;
    }());
    var InfoWindow = (function () {
        function InfoWindow() {
            this.opened = false;
            var self = this;
            document.getElementById('panel').addEventListener('click', function () { return self.close(); });
        }
        InfoWindow.prototype.close = function () {
            document.getElementById('panel').className = document.getElementById('panel').className.replace('opened', '');
            this.opened = false;
        };
        InfoWindow.prototype.open = function (data) {
            var me = this;
            if (this.opened) {
                this.close();
            }
            setTimeout(function () { return document.getElementById('panel').className += "opened"; }, 300);
            me.opened = true;
            this.setContent(me.getTemplate(data));
        };
        InfoWindow.prototype.getTemplate = function (data) {
            var html = "<span class=\"panel-content\"><span class=\"panel-header\">" + data.city + ", " + data.country + "</span><span class=\"panel-body\">";
            data.values.forEach(function (value, key) {
                var color = Util.getParty(labels[key].replace('%', '')).color;
                if (key < 7) {
                    // Global results
                    html += "<span class=\"row half\"><span class=\"title\">" + labels[key] + "</span><span class=\"value\">" + value + "</span></span>";
                }
                if (key >= 7 && key % 2 === 1) {
                    // Per candidate results
                    html += "<span class=\"row\">\n                                <span class=\"line\" style=\"width: " + value.replace(',', '.') + "%;background: " + color + "\"></span>\n                                <span class=\"title\">" + labels[key].replace('%', '') + "</span>\n                                <span class=\"value\">" + value + "% - <span class=\"nb\">" + data.values[key + 1] + " votes</span></span>\n                            </span>";
                }
            });
            html += '</span>';
            html += '</span>';
            return html;
        };
        InfoWindow.prototype.setContent = function (html) {
            document.getElementById('panel').innerHTML = html;
        };
        return InfoWindow;
    }());
    var Util = (function () {
        function Util() {
        }
        Util.getRandomColor = function () {
            var letters = '789ABCDEF';
            var color = '#';
            for (var i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 9)];
            }
            return color;
        };
        Util.isPortrait = function () {
            return (window.innerHeight > window.innerWidth);
        };
        Util.getParty = function (name) {
            var result;
            switch (name) {
                case 'M. Nicolas DUPONT-AIGNAN':
                    result = {
                        'sigle': 'DLF',
                        'nom': 'Debout La France',
                        'color': '#8040C0'
                    };
                    break;
                case 'Mme Marine LE PEN':
                    result = {
                        'sigle': 'FN',
                        'nom': 'Front National',
                        'color': '#c0c0c0'
                    };
                    result = 'fn';
                    break;
                case 'M. Emmanuel MACRON':
                    result = {
                        'sigle': 'EM',
                        'nom': 'En Marche',
                        'color': '#ffeb00'
                    };
                    break;
                case 'M. Benoît HAMON':
                    result = {
                        'sigle': 'PS',
                        'nom': 'Parti Socialiste',
                        'color': '#ff8080'
                    };
                    break;
                case 'Mme Nathalie ARTHAUD':
                    result = {
                        'sigle': 'LO',
                        'nom': 'Lutte ouvrière',
                        'color': '#bb0000'
                    };
                    break;
                case 'M. Philippe POUTOU':
                    result = {
                        'sigle': 'NPA',
                        'nom': 'Nouveau parti anticapitaliste',
                        'color': '#bb0000'
                    };
                    break;
                case 'M. Jacques CHEMINADE':
                    result = {
                        'sigle': 'S&P',
                        'nom': 'Solidarité et progrès',
                        'color': '#f0f0f0'
                    };
                    break;
                case 'M. Jean LASSALLE':
                    result = {
                        'sigle': '',
                        'nom': 'Résistons',
                        'color': '#ff9900'
                    };
                    break;
                case 'M. Jean-Luc MÉLENCHON':
                    result = {
                        'sigle': 'FI',
                        'nom': 'La France Insoumise',
                        'color': '#dd0000'
                    };
                    break;
                case 'M. François ASSELINEAU':
                    result = {
                        'sigle': 'UPR',
                        'nom': 'Union Populaire Républicaine',
                        'color': '#f0f0f0'
                    };
                    break;
                case 'M. François FILLON':
                    result = {
                        'sigle': 'LR',
                        'nom': 'Les Républicains',
                        'color': '#0066cc'
                    };
                    break;
                default:
                    result = {
                        'color': 'transparent'
                    };
                    break;
            }
            return result;
        };
        return Util;
    }());
    var InitMap = (function () {
        function InitMap() {
            var req = new Http();
            req.get('data/map_style.json', function (style) {
                map = new google.maps.Map(document.getElementById('map'), {
                    center: Util.isPortrait() ? { lat: 45, lng: 2.2775 } : { lat: 14, lng: 2.2775 },
                    zoom: Util.isPortrait() ? 5 : 2,
                    styles: style,
                    disableDefaultUI: true
                });
                setTimeout(function () {
                    new Main();
                }, 1000);
            });
        }
        return InitMap;
    }());
    MapElections.InitMap = InitMap;
})(MapElections || (MapElections = {}));
