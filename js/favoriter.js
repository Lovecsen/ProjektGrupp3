

function init() {

    showFavorites();

}
window.addEventListener("load", init);

function heart(elem) {

    const heartPicture = elem.querySelector(".heart");
    const placeId = heartPicture.dataset.id.toString();

    let favorites = JSON.parse(localStorage.getItem("favoriter")) || [];

    let liked = favorites.includes(placeId);

    if (liked) {
        heartPicture.src = "photos/smallredheart.svg";
    }

    heartPicture.addEventListener("pointerenter", () => {
        if (!liked) {
            heartPicture.src = "photos/smallredheart.svg";
        }
    });

    heartPicture.addEventListener("pointerleave", () => {
        if (!liked) {
            heartPicture.src = "photos/smallheart.svg";
        }
    });

    heartPicture.addEventListener("pointerdown", (e) => {
        e.stopPropagation();
        

        if (!liked) {
            heartPicture.src = "photos/smallredheart.svg";
            favorites.push(placeId);
            liked = true;
        } else {
            heartPicture.src = "photos/smallheart.svg";
            favorites = favorites.filter(id => id !== placeId);
            liked = false;
        }
        localStorage.setItem("favoriter", JSON.stringify(favorites));
    });
}

async function showFavorites() {
    const favIds = (JSON.parse(localStorage.getItem("favoriter")) || []).map(id => id.toString());

    let favoriteDiv = document.querySelector("#placeContainer");

    favoriteDiv.innerHTML = ""; //rensa innehåll först

    if (favIds.length == 0) {

        favoriteDiv.innerText = "Du har inte lagt några resmål i favoriter ännu";
        return;
    }

    let myApiKey = "Tc9ZD2gK";
    
    const descriptions = "zipline,temapark,klippklättring,nöjespark,sevärdhet,museum,konstgalleri,glasbruk,slott,kyrka,hembygdspark,fornlämning,myrstack,naturreservat" //alla descriptions vi vill hämta

    let response = await fetch("https://smapi.lnu.se/api/?api_key=" + myApiKey + "&controller=establishment&method=getall&descriptions=" + descriptions); //skicka förfrågan tilll SMAPI

    let data = await response.json();
    const places = data.payload;

    let favoritePlaces = [];
    
    for (let i = 0; i < places.length; i++) {
        if (favIds.includes(places[i].id.toString())) {
            favoritePlaces.push(places[i]);
        }
    }


    for (let i = 0; i < favoritePlaces.length; i++) {
        const place = favoritePlaces[i];
        const div = document.createElement("div");
        div.classList.add("smapiPlace");

        let shortDescription = "";

        // Om beskrivningen är längre än 100 tecken, kapa och lägg till "..."
        if (place.abstract.length > 100) {
            shortDescription = place.abstract.substring(0, 100).trim() + "...";
        } else {
            shortDescription = place.abstract.trim(); //annars använd hela beskrivningen
        }

        let imgUrl = "";

        div.innerHTML = "<img src='" + imgUrl + "' alt='" + place.name + "' class='picture'><img src='photos/trash.svg' alt='ta bort favorit' class='trash' data-id='" + place.id + "'><h4>" + place.name + "</h4><p>Stad: " + place.city + "</p><p>Pris: " + place.price_range + " kr</p>" + "<p>Beskrivning: " + shortDescription; //skriver ut infon i div-elementet

        favoriteDiv.appendChild(div);
    }

}
