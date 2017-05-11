namespace MapElections {
    declare let map;
    declare let google;
    declare let RichMarker;
    declare let RichMarkerPosition;
    let labels: Array<string> = [
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
    class Http{
        get(url: string, callback: any, error?: any){
            const req = new XMLHttpRequest();
            req.onreadystatechange = () => {
                if (req.readyState === XMLHttpRequest.DONE) {
                    if (req.status === 200) {
                        if(typeof callback === 'function'){
                            callback(JSON.parse(req.responseText));
                        }
                    } else {
                        if(typeof error === 'function'){
                            error(req.status, req.statusText);
                        }
                    }
                }
            };

            req.open('GET', url, true);
            req.send(null);
        }
    }
    class Loader{
        static update(value: number, total: number): void{
            setTimeout(() => {
                let percent = ((value / (total - 1)) * 100).toFixed();
                document.querySelector('.progress').innerHTML = percent + '%';
                if(percent === '100'){
                    document.querySelector('.progress').innerHTML = percent + '%';
                    setTimeout(function() {
                        if(document.querySelector('.loading-box')){
                            document.querySelector('.loading-box').parentNode.removeChild(document.querySelector('.loading-box'));
                        }
                    }, 300);
                }
            }, 300);
        }
    }
    class Main{
        public static iw:InfoWindow;
        constructor(){
            const req = new Http();
            req.get('data/data.json', (data) => {
                data.forEach((point, pointKey) => {
                    let marker = new RichMarker({
                        position: new google.maps.LatLng(point.lat,  point.lng),
                        map: map,
                        anchor: RichMarkerPosition.BOTTOM,
                        content: '<div class="my-marker"><div class="pin" style="background: ' + Util.getRandomColor() + '"></div></div>'
                    });
                    marker.addListener('click', () =>{
                        if(!Main.iw){
                            Main.iw = new InfoWindow();
                        }
                        map.panTo(marker.getPosition());
                        Main.iw.open(point);
                    });
                    map.addListener('bounds_changed', () => {
                        if(Main.iw){
                            Main.iw.close();
                        }
                    });
                    document.getElementById('map').style.opacity = "1";
                    Loader.update(pointKey, data.length);
                });
            });
        }
    }
    class InfoWindow{
        opened: boolean = false;
        constructor(){
            let self = this;
            document.getElementById('panel').addEventListener('click', () => self.close());
        }
        close(){
            document.getElementById('panel').className = document.getElementById('panel').className.replace('opened', '');
            this.opened = false;
        }
        open(data: object){
            let me = this;
            if(this.opened){
                this.close();
            }
            setTimeout(() => document.getElementById('panel').className += "opened", 300);
            me.opened = true;
            this.setContent(me.getTemplate(data));
        }
        getTemplate(data: any): string{
            let html = `<span class="panel-content"><span class="panel-header">${data.city}, ${data.country}</span><span class="panel-body">`;
            data.values.forEach(function(value, key){
                let color = Util.getParty(labels[key].replace('%', '')).color;
                if(key < 7){
                    // Global results
                    html += `<span class="row half"><span class="title">${labels[key]}</span><span class="value">${value}</span></span>`;
                }
                if(key >= 7 && key % 2 === 1){
                    // Per candidate results
                    html += `<span class="row">
                                <span class="line" style="width: ${value.replace(',','.')}%;background: ${color}"></span>
                                <span class="title">${labels[key].replace('%', '')}</span>
                                <span class="value">${value}% - <span class="nb">${data.values[key + 1]} votes</span></span>
                            </span>`;
                }
            });
            html += '</span>';
            html += '</span>';
            return html;
        }
        setContent(html: string){
            document.getElementById('panel').innerHTML = html;
        }
    }
    class Util{
        static getRandomColor() {
            let letters = '789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++ ) {
                color += letters[Math.floor(Math.random() * 9)];
            }
            return color;
        }
        static isPortrait():boolean{
            return (window.innerHeight > window.innerWidth);
        }
        static getParty(name): {color, sigle, nom} {
            let result;
            switch(name){
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
        }
    }
    export class InitMap{
        constructor(){
            const req = new Http();
            req.get('data/map_style.json', (style) => {
                map = new google.maps.Map(document.getElementById('map'), {
                    center: Util.isPortrait() ? {lat: 45, lng: 2.2775} : {lat: 14, lng: 2.2775},
                    zoom: Util.isPortrait() ? 5: 2,
                    styles: style,
                    disableDefaultUI: true
                });
                setTimeout(function(){
                    new Main();
                }, 1000);
            });
        }
    }
}
