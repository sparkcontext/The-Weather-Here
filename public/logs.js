const mymap = L.map('checkinMap').setView([0,0],1);
//const marker = L.marker([0,0]).addTo(mymap);

const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tiles = L.tileLayer(tileUrl, {attribution});
tiles.addTo(mymap);
getData();
async function getData(){
    const response = await fetch('/api');
    const data = await response.json();
    for (item of data){

        const marker = L.marker([item.lat,item.lon]).addTo(mymap);

        let txt = `The weather here 
        at ${item.lat}&deg;, ${item.lon}&deg;
        is ${item.weather.summary}
        with a temperature of ${item.weather.temperature}
        &deg; C.        
        <br />`;

        if(item.air.value <0){
            txt+=`no air quality reading`;
        }else{
            txt+= `The concentration of particulate matter 
            (${item.air.parameter})
            is ${item.air.value} ${item.air.unit}
            last read on ${item.air.lastUpdated}.`;
        }
        marker.bindPopup(txt);

        //const root = document.createElement('p');
        //const geo = document.createElement('div');
        //const date = document.createElement('div');
        //const dateString = new Date(item.timestamp).toLocaleString();
        
        //geo.textContent = `${item.lat}°,${item.lon}°`;
        //date.textContent = dateString;
        
        //root.append(geo,date);

        //document.body.append(root);

    }
    console.log(data);
}