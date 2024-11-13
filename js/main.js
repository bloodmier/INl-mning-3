//Man behöver updatera sidan mellan dom olika pixel alternativen för att det ska fungera correct

/*
Hade med denna men känns som den kan skapa mer problem än nytta

let reloaded = false;
window.addEventListener('resize', () => {
    if (!reloaded) {
        if (window.innerWidth < 585) {
            reloaded = true;
            location.reload();
        } else if (window.innerWidth >= 585 && window.innerWidth < 1212) {
            reloaded = true;
            location.reload();
        } else if (window.innerWidth >= 1212) {
            reloaded = true;
            location.reload();
        }
    }
}); 

*/
 
//Jag är själv nöjd med hemsidan/aplikation hur den blev hoppas du blir lika tillfredsställd med resultatet!
//vet inte om det är dumt att lägga variabler globalt eller om man ska hämta dom varje gång man ska använda dom?

                                                                                                                       
const breed = document.getElementById("dog-list");
const input = document.getElementById("dog-list");
const suggestions = document.getElementById("suggestions");
const dogBreeds = document.getElementById("dog-breeds");
const showButton = document.getElementById('select-dog');
const RandomButton = document.getElementById('Random');


let isOptionSelected = false;


setTimeout(() => {                      //lösa en bugg att iconen inte hann att ladda så man såg texten innan iconen, tror detta gjorde susen
showButton.style.display = 'none';
}, 5);

input.addEventListener("input", () => {                                                                                // Inputtext fältet söker genom select-options efter matchande alternativ
    const searchTerm = input.value.toLowerCase();
    suggestions.innerHTML = ""; 
    
    if (!searchTerm) {
        suggestions.style.display = "none";
    } else {
        suggestions.style.display = "block";
    }

    const matchedOptions = [];


    Array.from(dogBreeds.options).forEach(option => {
        if (option.value !== "start" && option.text.toLowerCase().startsWith(searchTerm)) {
            matchedOptions.push(option); 
        }
    });

    const suggestionsToShow = matchedOptions;

 
    suggestionsToShow.forEach(option => {
        const suggestionItem = document.createElement("div");
        suggestionItem.textContent = option.text; 
        suggestionItem.classList.add("suggestion-item");
        suggestionItem.onclick = () => selectOption(option); 
        suggestions.appendChild(suggestionItem);
    });

    isOptionSelected = false;
    showButton.style.display = 'none'; 
});

function selectOption(option) {                                                                                       //funtion som gör att man väljer ett av dom förslagna alternativen
    input.value = option.text; 
    suggestions.innerHTML = ""; 
    dogBreeds.value = option.value;
    isOptionSelected = true;
    showButton.style.display = 'block';
}

async function fetchdata(url) {                                                                                       //Hämtar api datan
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status} ${response.statusText}`);

        }
        const data = await response.json();
        return data;  

    } catch (error) {
        const statusCode = error.message.match(/\d+/)[0];
        const errorImageUrl = await fetchErrormessagedog(statusCode);

        document.getElementById("middle-section").innerHTML = 
        `<div class="dog-image">
             <img src="${errorImageUrl}" alt="="Error Image">
         </div>`;
        console.log(`There has been a problem with your fetch operation: ${error.message}`);

        return null 
    }
}

function getRandomRotation() {                                                                                  // gör en random rotation på bilder på datorn
    const min = -10;
    const max = 10; 
    return Math.random() * (max - min) + min; 
}

async function fetchErrormessagedog(statusCode) {                                                               //Laddar in en felkodsbild på hundar om det inte går att nå api
    const url = `https://http.dog/${statusCode}.jpg`;
    return url;
}


async function fetchRandomdog(e) {                                                                              //Hämtar en random dog från api
    e.preventDefault();
    const data = await fetchdata(`https://random.dog/woof.json`);
        const fileType = data.url.split('.').pop();
        let midleContent = document.getElementById("middle");

        if (!midleContent)
            {   
                setTimeout(() => {
                document.getElementById("top").classList.remove("move-down");
                }, 0)
                midleContent = document.createElement('section');
                midleContent.id = "middle";
                const wrapper = document.getElementById('wrapper')
                wrapper.appendChild(midleContent);
                
            }

if (window.innerWidth < 585) {                                                                                  // Mobil variation

                setTimeout(() => {
                    let element;  
                    input.value = ""
                    showButton.style.display = 'none';
            
                    if (fileType === 'mp4') {
                        element = `
                                <section id="middle-section">
                                   <div class="foreground-videocontainer">
                                        <video controls autoplay loop id="video-phone">
                                            <source src="${data.url}" type="video/mp4">
                                            Your browser does not support the video tag.
                                        </video>
                                    </div>
                                </section>
                                   `;
                    } else {
                        element = `
                                <section id="middle-section">
                                    <img src="${data.url}" alt="Random Dog" class="img-phone">
                                </section>
                                    `;
                    }
                    midleContent.innerHTML = element;
                },50)
                setTimeout(() => {
                RandomButton.classList.remove("Random-top");
                RandomButton.classList.add("Random-bottom");
                RandomButton.innerHTML = `<img class="Random-img" src="./img/next.png">`;
                }, 400)

} else {                                                                                                    //Tablet och large desktop

        setTimeout(() => {
        let element;
        const randomRotation = getRandomRotation();
        
        input.value = ""
        showButton.style.display = 'none';

       
        if (fileType === 'mp4') {
            element = `
                    <section id="middle-section">
                        <div class="background-overlay" >
                            <video mute loop id="video-background">
                              <source src="${data.url}" type="video/mp4" >
                              Your browser does not support the video tag.
                            </video>
                       </div>
                       <div class="foreground-videocontainer">
                            <video controls loop id="foreground-video">
                                <source src="${data.url}" type="video/mp4">
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    </section>
                       `;
        } else {

            element = `
                    <section id="middle-section">
                        <div class="background-overlay" style="background-image: url('${data.url}')"></div>
                        <img src="${data.url}" alt="Random Dog" class="imgtop" style="transform: translate(-50%, -50%) rotate(${randomRotation}deg);">
                    </section>
                        `;
        }
        
        midleContent.innerHTML = element;
       
        if (fileType === 'mp4') {
        playvideoatthesametime()
        }
    },500)
}}

function playvideoatthesametime(){                                                                              //Function som gör att bakgrundsvideo och video spelas samtidigt
    const backgroundVideo = document.getElementById('video-background');
    const foregroundVideo = document.getElementById('foreground-video');

    backgroundVideo.addEventListener('canplaythrough', () => {
        if (foregroundVideo.readyState >= 3) {
            backgroundVideo.play();
            foregroundVideo.play();
        }
    });

    foregroundVideo.addEventListener('canplaythrough', () => {
        if (backgroundVideo.readyState >= 3) {
            backgroundVideo.play();
            foregroundVideo.play();
        }
    });

}


async function fetchDogbreedpicture(e) {                                                                      //Onclick event, när man trycker på den sökta hunden så gör den det här!
    e.preventDefault();

    const breedoption = document.getElementById("dog-breeds")
    const breedValue = breedoption.value;
    const data = await fetchdata(`https://dog.ceo/api/breed/${breedValue}/images/random`);
    const showbutton = document.getElementById('select-dog')
    
    input.value = "";
    showbutton.style.display = 'none';

if (window.innerWidth < 585) {                                                                                //mobile verion

    RandomButton.classList.remove("Random-bottom");
    RandomButton.classList.add("Random-top");
    RandomButton.innerHTML = `Random dog`;

    let midleContent = document.getElementById("middle");

    document.getElementById("top").classList.remove("move-down");

        if (!midleContent)
            {
                midleContent = document.createElement('section');
                midleContent.id = "middle";
                const wrapper = document.getElementById('wrapper')
                wrapper.appendChild(midleContent);
            }
            
            
    setTimeout(() => {
        
        if (!data) {
            midleContent.innerHTML = `<div class="dog-image-container">Couldn't find any picture, sorry.</div>`;
            button.disabled = false;
            return;
        }
        

        midleContent.innerHTML = 
        `<div class="dog-image-container">
             <img src="${data.message}" alt="Random Dog">
             <button class="Random-bottom"  onclick="generateNewPicture()" role="button"><img class="Random-img" src="./img/next.png"></button>
         </div>`;

         fetchDogbreedinfo()
         
    },500);

} else {                                                                                                    // desktop and large desktop

        let midleContent = document.getElementById("middle");

        document.getElementById("top").classList.remove("move-down");

            if (!midleContent)
                {
                    midleContent = document.createElement('section');
                    midleContent.id = "middle";
                    const wrapper = document.getElementById('wrapper')
                    wrapper.appendChild(midleContent);
                }
                
                
        setTimeout(() => {
            if (!data) {
                midleContent.innerHTML = `<div class="dog-image-container">Couldn't find any picture, sorry.</div>`;
                button.disabled = false;
                return;
            }
        
            midleContent.innerHTML = 
            `<div class="dog-image-container">
                <img src="${data.message}" alt="Random Dog">
                <button id="New-picture"  onclick="generateNewPicture()" role="button"><span class="text">New picture</span></button>
             </div>`;

            fetchDogbreedinfo()
            
        },500);
}}

async function generateNewPicture() {                                                                         //Onclick function för att generera en ny bild på den valda hunden
            const breedoption = document.getElementById("dog-breeds")
            const breedValue = breedoption.value;
            const data = await fetchdata(`https://dog.ceo/api/breed/${breedValue}/images/random`);
        
            const dogImage = document.querySelector('.dog-image-container img');
            dogImage.src = data.message; 
}
        

async function fetchDogbreedinfo() {                                                                           //skapar informations innehållet på hemsidan
    const breedoption = document.getElementById("dog-breeds")
    const breeddatanumber = breedoption.options[breedoption.selectedIndex]
    const breedValue = breeddatanumber.value;
    const brednumber = breeddatanumber.getAttribute(`data-number`)

    let midleContent = document.getElementById("middle");
    let data;

    if (manualBreedData[breedValue]) {
        data = manualBreedData[breedValue];
    }else {
    data = await fetchdata(`https://api.thedogapi.com/v1/breeds/${brednumber}`)
    }

    if (window.innerWidth < 1212) {                                                                             //Innehållet på desktop/surfplatta

        let breedInfo = '';
        if (data.name) breedInfo += `<h3>${data.name}</h3>`;                                                     //kontrollerar att varje innehåll finns 
        if (data.bred_for) breedInfo += `<p>Used for: ${data.bred_for}</p>`;
        if (data.breed_group) breedInfo += `<p>Breed group: ${data.breed_group}</p>`;
        if (data.life_span) breedInfo += `<p>Lifespan: ${data.life_span}</p>`;
        if (data.temperament) breedInfo += `<p>Temperament: ${data.temperament}</p>`;
        if (manualBreedData[breedValue]) {                                                                          //Tar innehåll manuelt från dom hundar som inte fanns på api
            if (data.height) breedInfo += `<p><span class="Height-head">Height: </span>${data.height} cm</p>`;
            if (data.weight) breedInfo += `<p><span class="Weight-head">Weight: </span>${data.weight} kg</p>`;
        } else {
            if (data.weight.metric) breedInfo += `<p><span class="Height-head">Height: </span>${data.height.metric} cm</p>`;
            if (data.height.metric) breedInfo += `<p><span class="Weight-head">Weight: </span>${data.weight.metric} kg</p>`;
        }
        
        midleContent.innerHTML += `<div class="left-breed-container">${breedInfo}</div>`;

    } else {                                                                                                         //innnehåll på large desktop 

        let breedInfo = '';

        if (data.name) breedInfo += `<h3>${data.name}</h3>`;
        if (data.bred_for) breedInfo += `<p>Used for: ${data.bred_for}</p>`;
        if (data.breed_group) breedInfo += `<p>Breed group: ${data.breed_group}</p>`;
        if (data.life_span) breedInfo += `<p>Lifespan: ${data.life_span}</p>`;
        if (data.temperament) breedInfo += `<p>Temperament: ${data.temperament}</p>`;
        
        midleContent.innerHTML += `<div class="left-breed-container">${breedInfo}</div>`;
        
        let breedWeightHeight = '';

        if (manualBreedData[breedValue]) {
            if (data.height) breedWeightHeight += `<p><span class="Height-head">Height: </span> ${data.height} cm</p>`;
            if (data.weight) breedWeightHeight += `<p><span class="Weight-head">Weight: </span> ${data.weight} kg</p>`;
        } else {
            if (data.weight.metric) breedWeightHeight += `<p><span class="Height-head">Height: </span>${data.height.metric} cm</p>`;
            if (data.height.metric) breedWeightHeight += `<p><span class="Weight-head">Weight: </span>${data.weight.metric} kg</p>`;
        }
        
        midleContent.innerHTML += `<div class="right-breedweight-container">${breedWeightHeight}</div>`
    }
}


//Ett jävla jobb
//Hundarna som inte fanns på api hoppas jag fick med alla har inte hunnit testa
const manualBreedData = {                                                                   //La till alla hundar tror jag som inte fanns på api

    "bakharwal/indian": {
        name: "Bakharwal Indian",
        bred_for: "Herding",
        breed_group: "Working",
        life_span: "10 - 12 years",
        temperament: "Intelligent, Loyal",
        height: "55 - 75",
        weight: "30 - 40"
    },

    "gaddi/indian": {
    name: "Indian Gaddi Dog",
    bred_for: "Herding and guarding livestock",
    breed_group: "Working",
    life_span: "10 - 12 years",
    temperament: "Intelligent, Loyal, Protective",
    height: "55 - 75",
    weight: "30 - 40"
    },

    "rajapalayam/indian": {
    name: "Rajapalayam",
    bred_for: "Hunting wild boar and guarding",
    breed_group: "Sighthound",
    life_span: "10 - 12 years",
    temperament: "Loyal, intelligent, vigilant, reserved with strangers",
    height: "65 - 75",
    weight: "20 - 25"
    },

    "puggle": {
    name: "Puggle",
    bred_for: "Companionship",
    breed_group: "Mixed Breed",
    life_span: "10 - 15 years",
    temperament: "Friendly, playful, affectionate, energetic",
    height: "6 - 13",
    weight: "25 - 38"
    },
    
    "borzoi": {
        name: "Borzoi",
        bred_for: "Coursing",
        breed_group: "Hound",
        life_span: "10 - 12 years",
        temperament: "Loyal, Independent, Dignified",
        height: "27 - 48",
        weight: "68 - 85"
    },

    "brabancon": {
        name: "Brabancon",
        bred_for: "Companion",
        breed_group: "Toy",
        life_span: "12 - 15 years",
        temperament: "Alert, Curious, Loyal",
        height: "3 - 6",
        weight: "23 - 28"
    },

    "buhund/norwegian": {
        name: "Norwegian Buhund",
        bred_for: "Herding",
        breed_group: "Working",
        life_span: "12 - 15 years",
        temperament: "Confident, Hardy, Friendly",
        height: "12 - 18",
        weight: "41 - 47"
    },

    "bulldog/boston": {
        name: "Boston Bulldog",
        bred_for: "Companion",
        breed_group: "Non-Sporting",
        life_span: "11 - 13 years",
        temperament: "Friendly, Bright, Adaptable",
        height: "7 - 11",
        weight: "38 - 43"
    },

    "cavapoo": {
        name: "Cavapoo",
        bred_for: "Companion",
        breed_group: "Designer",
        life_span: "12 - 15 years",
        temperament: "Affectionate, Sociable, Gentle",
        height: "5 - 12",
        weight: "25 - 38"
    },

    "chihuahua": {
        name: "Chihuahua",
        bred_for: "Companion",
        breed_group: "Toy",
        life_span: "14 - 16 years",
        temperament: "Alert, Devoted, Quick",
        height: "1.5 - 3",
        weight: "15 - 23"
    },

    "chippiparai/indian": {
        name: "Indian Chippiparai",
        bred_for: "Hunting",
        breed_group: "Hound",
        life_span: "12 - 15 years",
        temperament: "Loyal, Independent, Affectionate",
        height: "15 - 20",
        weight: "63 - 76"
    },

    "cockapoo": {
        name: "Cockapoo",
        bred_for: "Companion",
        breed_group: "Designer",
        life_span: "13 - 15 years",
        temperament: "Happy, Friendly, Intelligent",
        height: "5 - 12",
        weight: "25 - 38"
    },

    "cotondetulear": {
        name: "Coton de Tulear",
        bred_for: "Companion",
        breed_group: "Non-Sporting",
        life_span: "14 - 16 years",
        temperament: "Affectionate, Playful, Intelligent",
        height: "3.5 - 6",
        weight: "23 - 28"
    },

    "dachshund": {
        name: "Dachshund",
        bred_for: "Hunting",
        breed_group: "Hound",
        life_span: "12 - 16 years",
        temperament: "Clever, Lively, Courageous",
        height: "7 - 15",
        weight: "20 - 23"
    },

    "danish/swedish": {
        name: "Swedish Danish",
        bred_for: "Herding",
        breed_group: "Working",
        life_span: "11 - 13 years",
        temperament: "Friendly, Energetic, Intelligent",
        height: "7 - 15",
        weight: "32 - 38"
        
    },

    "bakharwal/indian": {
        name: "Bakharwal Indian",
        bred_for: "Herding",
        breed_group: "Working",
        life_span: "10 - 12 years",
        temperament: "Intelligent, Loyal",
        height: "30 - 40",
        weight: "55 - 75"
    },

    "borzoi": {
        name: "Borzoi",
        bred_for: "Coursing",
        breed_group: "Hound",
        life_span: "10 - 12 years",
        temperament: "Loyal, Independent, Dignified",
        height: "27 - 48",
        weight: "68 - 85"
    },

    "brabancon": {
        name: "Brabancon",
        bred_for: "Companion",
        breed_group: "Toy",
        life_span: "12 - 15 years",
        temperament: "Alert, Curious, Loyal",
        height: "3 - 6",
        weight: "23 - 28"
    },

    "buhund/norwegian": {
        name: "Norwegian Buhund",
        bred_for: "Herding",
        breed_group: "Working",
        life_span: "12 - 15 years",
        temperament: "Confident, Hardy, Friendly",
        height: "12 - 18",
        weight: "41 - 47"
    },

    "bulldog/boston": {
        name: "Boston Bulldog",
        bred_for: "Companion",
        breed_group: "Non-Sporting",
        life_span: "11 - 13 years",
        temperament: "Friendly, Bright, Adaptable",
        height: "7 - 11",
        weight: "38 - 43"
    },

    "cavapoo": {
        name: "Cavapoo",
        bred_for: "Companion",
        breed_group: "Designer",
        life_span: "12 - 15 years",
        temperament: "Affectionate, Sociable, Gentle",
        height: "5 - 12",
        weight: "25 - 38"
    },

    "chihuahua": {
        name: "Chihuahua",
        bred_for: "Companion",
        breed_group: "Toy",
        life_span: "14 - 16 years",
        temperament: "Alert, Devoted, Quick",
        height: "1.5 - 3",
        weight: "15 - 23"
    },

    "chippiparai/indian": {
        name: "Indian Chippiparai",
        bred_for: "Hunting",
        breed_group: "Hound",
        life_span: "12 - 15 years",
        temperament: "Loyal, Independent, Affectionate",
        height: "15 - 20",
        weight: "63 - 76"
    },

    "cockapoo": {
        name: "Cockapoo",
        bred_for: "Companion",
        breed_group: "Designer",
        life_span: "13 - 15 years",
        temperament: "Happy, Friendly, Intelligent",
        height: "5 - 12",
        weight: "25 - 38"
    },

    "cotondetulear": {
        name: "Coton de Tulear",
        bred_for: "Companion",
        breed_group: "Non-Sporting",
        life_span: "14 - 16 years",
        temperament: "Affectionate, Playful, Intelligent",
        height: "3.5 - 6",
        weight: "23 - 28"
    },

    "dachshund": {
        name: "Dachshund",
        bred_for: "Hunting",
        breed_group: "Hound",
        life_span: "12 - 16 years",
        temperament: "Clever, Lively, Courageous",
        height: "7 - 15",
        weight: "20 - 23"
    },

    "danish/swedish": {
        name: "Swedish Danish",
        bred_for: "Herding",
        breed_group: "Working",
        life_span: "11 - 13 years",
        temperament: "Friendly, Energetic, Intelligent",
        height: "10 - 14",
        weight: "32 - 38"
    },

    "dhole": {
        name: "Dhole",
        bred_for: "Hunting",
        breed_group: "Working",
        life_span: "10 - 14 years",
        temperament: "Loyal, Energetic, Social",
        height: "30 - 50",
        weight: "18 - 24"
    },

    "elkhound/norwegian": {
        name: "Norwegian Elkhound",
        bred_for: "Herding",
        breed_group: "Hound",
        life_span: "12 - 15 years",
        temperament: "Loyal, Friendly, Bold",
        height: "48 - 55",
        weight: "18 - 20"
    },

    "entlebucher": {
        name: "Entlebucher Mountain Dog",
        bred_for: "Herding",
        breed_group: "Working",
        life_span: "12 - 15 years",
        temperament: "Energetic, Loyal, Intelligent",
        height: "40 - 65",
        weight: "16 - 21"
    },

    "groenendael": {
        name: "Belgian Groenendael",
        bred_for: "Herding",
        breed_group: "Herding",
        life_span: "12 - 15 years",
        temperament: "Intelligent, Protective, Energetic",
        height: "50 - 75",
        weight: "22 - 26"
    },

    "kombai": {
        name: "Kombai",
        bred_for: "Hunting",
        breed_group: "Working",
        life_span: "10 - 12 years",
        temperament: "Loyal, Brave, Alert",
        height: "45 - 65",
        weight: "20 - 25"
    },

    "labradoodle": {
        name: "Labradoodle",
        bred_for: "Companionship",
        breed_group: "Mixed",
        life_span: "12 - 14 years",
        temperament: "Friendly, Active, Outgoing",
        height: "50 - 65",
        weight: "21 - 24"
    },

    "mountain/swiss": {
        name: "Swiss Mountain Dog",
        bred_for: "Herding",
        breed_group: "Working",
        life_span: "8 - 11 years",
        temperament: "Gentle, Loyal, Strong",
        height: "75 - 140",
        weight: "23 - 30"
    },

    "mudhol/indian": {
        name: "Mudhol Hound",
        bred_for: "Hunting",
        breed_group: "Hound",
        life_span: "10 - 12 years",
        temperament: "Intelligent, Loyal, Protective",
        height: "35 - 60",
        weight: "20 - 26"
    },

    "sharpei": {
        name: "Shar Pei",
        bred_for: "Guarding",
        breed_group: "Non-Sporting",
        life_span: "8 - 12 years",
        temperament: "Independent, Loyal, Reserved",
        height: "45 - 60",
        weight: "18 - 20"
    },

    "sheepdog/indian": {
        name: "Indian Sheepdog",
        bred_for: "Herding",
        breed_group: "Working",
        life_span: "10 - 12 years",
        temperament: "Intelligent, Protective, Loyal",
        height: "50 - 80",
        weight: "20 - 28"
    },

    "shihtzu": {
        name: "Shih Tzu",
        bred_for: "Companionship",
        breed_group: "Toy",
        life_span: "10 - 16 years",
        temperament: "Affectionate, Playful, Outgoing",
        height: "9 - 16",
        weight: "9 - 10.5"
    },

    "spaniel/blenheim": {
        name: "Blenheim Spaniel",
        bred_for: "Companionship",
        breed_group: "Toy",
        life_span: "10 - 12 years",
        temperament: "Affectionate, Gentle, Friendly",
        height: "10 - 18",
        weight: "12 - 13"
    },

    "spaniel/brittany": {
        name: "Brittany Spaniel",
        bred_for: "Hunting",
        breed_group: "Sporting",
        life_span: "12 - 14 years",
        temperament: "Energetic, Friendly, Intelligent",
        height: "30 - 40",
        weight: "17.5 - 20.5"
    },

    "spaniel/irish": {
        name: "Irish Spaniel",
        bred_for: "Hunting",
        breed_group: "Sporting",
        life_span: "12 - 14 years",
        temperament: "Friendly, Energetic, Loyal",
        height: "30 - 50",
        weight: "20 - 25"
    },

    "spaniel/japanese": {
        name: "Japanese Spaniel",
        bred_for: "Companionship",
        breed_group: "Toy",
        life_span: "10 - 12 years",
        temperament: "Playful, Friendly, Alert",
        height: "4 - 9",
        weight: "8 - 11"
    },

    "spaniel/sussex": {
        name: "Sussex Spaniel",
        bred_for: "Hunting",
        breed_group: "Sporting",
        life_span: "12 - 14 years",
        temperament: "Loyal, Gentle, Affectionate",
        height: "35 - 45",
        weight: "13 - 15"
    },

    "spaniel/welsh": {
        name: "Welsh Spaniel",
        bred_for: "Hunting",
        breed_group: "Sporting",
        life_span: "12 - 15 years",
        temperament: "Friendly, Energetic, Loyal",
        height: "35 - 50",
        weight: "15 - 18"
    },

    "spitz/indian": {
        name: "Indian Spitz",
        bred_for: "Companionship",
        breed_group: "Working",
        life_span: "12 - 15 years",
        temperament: "Lively, Intelligent, Friendly",
        height: "10 - 25",
        weight: "10 - 15"
    },

    "stbernard": {
        name: "St. Bernard",
        bred_for: "Rescue",
        breed_group: "Working",
        life_span: "8 - 10 years",
        temperament: "Gentle, Friendly, Patient",
        height: "110 - 200",
        weight: "26 - 30"
    },

    "terrier/american": {
        name: "American Terrier",
        bred_for: "Companionship",
        breed_group: "Terrier",
        life_span: "12 - 16 years",
        temperament: "Energetic, Friendly, Courageous",
        height: "25 - 40",
        weight: "10 - 16"
    },

    "terrier/dandie": {
        name: "Dandie Dinmont Terrier",
        bred_for: "Herding",
        breed_group: "Terrier",
        life_span: "11 - 15 years",
        temperament: "Affectionate, Alert, Playful",
        height: "18 - 24",
        weight: "8 - 12"
    },

    "terrier/kerryblue": {
        name: "Kerry Blue Terrier",
        bred_for: "Herding",
        breed_group: "Terrier",
        life_span: "12 - 15 years",
        temperament: "Intelligent, Energetic, Loyal",
        height: "30 - 40",
        weight: "18 - 20"
    },

    "terrier/lakeland": {
        name: "Lakeland Terrier",
        bred_for: "Hunting",
        breed_group: "Terrier",
        life_span: "12 - 16 years",
        temperament: "Energetic, Friendly, Intelligent",
        height: "15 - 17",
        weight: "13 - 15"
    },

    "terrier/patterdale": {
        name: "Patterdale Terrier",
        bred_for: "Hunting",
        breed_group: "Terrier",
        life_span: "12 - 15 years",
        temperament: "Energetic, Loyal, Fearless",
        height: "11 - 13",
        weight: "10 - 15"
    },

    "terrier/russell": {
        name: "Russell Terrier",
        bred_for: "Hunting",
        breed_group: "Terrier",
        life_span: "12 - 15 years",
        temperament: "Energetic, Playful, Friendly",
        height: "13 - 17",
        weight: "10 - 15"
    },

    "terrier/sealyham": {
        name: "Sealyham Terrier",
        bred_for: "Hunting",
        breed_group: "Terrier",
        life_span: "12 - 14 years",
        temperament: "Affectionate, Loyal, Brave",
        height: "20 - 24",
        weight: "10 - 12"
    },

    "terrier/welsh": {
        name: "Welsh Terrier",
        bred_for: "Hunting",
        breed_group: "Terrier",
        life_span: "12 - 15 years",
        temperament: "Friendly, Bold, Energetic",
        height: "20 - 24",
        weight: "14 - 15"
    },

    "terrier/westhighland": {
        name: "West Highland White Terrier",
        bred_for: "Hunting",
        breed_group: "Terrier",
        life_span: "12 - 16 years",
        temperament: "Friendly, Energetic, Intelligent",
        height: "13 - 22",
        weight: "10 - 11"
    },

    "waterdog/spanish": {
        name: "Spanish Water Dog",
        bred_for: "Herding",
        breed_group: "Working",
        life_span: "10 - 14 years",
        temperament: "Intelligent, Energetic, Loyal",
        height: "30 - 50",
        weight: "16 - 20"
    }
}


