let navKonyvekItem = document.getElementById('nav-konyvek')
let navUjKonyv = document.getElementById('nav-ujKonyv')
let container = document.getElementById('container')

document.body.onload = async () => {
    container.innerHTML = '';
    let data = await getdATA();
    for (let i = 0; i < data.length; i++) {
        container.appendChild(CreateCard(data[i]));
        console.log(data[i]);
    }

}

navKonyvekItem.onclick = async () => {
    container.innerHTML = '';
    let data = await getdATA();
    for (let i = 0; i < data.length; i++) {
        container.appendChild(CreateCard(data[i]));
    }
    
}

navUjKonyv.onclick = async () => {
    let data = await getdATA();
    let form = CreateForm(data[data.length - 1].id + 1);
    container.appendChild(form);
    
}

function CreateForm(myid, mydata = null) {
    container.innerHTML = '';
    let form = document.createElement('form');

    let labelNev = document.createElement('label');
    labelNev.innerText = 'Könyv neve:';
    let inputNev = document.createElement('input');
    inputNev.type = 'text';
    inputNev.classList.add('form-control');
    inputNev.value = mydata ? mydata.nev : '';
    let divNev = document.createElement('div');
    divNev.appendChild(labelNev);
    divNev.appendChild(inputNev);

    let labelKiadasEve = document.createElement('label');
    labelKiadasEve.innerText = 'Kiadas eve:';
    let inputKiadasEve = document.createElement('input');
    inputKiadasEve.type = 'number';
    inputKiadasEve.classList.add('form-control');
    inputKiadasEve.value = mydata ? mydata.kiadasEve : '';
    let divKiadasEve = document.createElement('div');
    divKiadasEve.appendChild(labelKiadasEve);
    divKiadasEve.appendChild(inputKiadasEve);

    let labelErtek = document.createElement('label');
    labelErtek.innerText = 'Ertek:';
    let inputErtek = document.createElement('input');
    inputErtek.type = 'number';
    inputErtek.classList.add('form-control');
    inputErtek.value = mydata ? mydata.ertekeles : '';
    let divErtek = document.createElement('div');
    divErtek.appendChild(labelErtek);
    divErtek.appendChild(inputErtek);

    let labelKep = document.createElement('label');
    labelKep.innerText = 'Kép:';
    let inputKep = document.createElement('input');
    inputKep.type = 'text';
    inputKep.classList.add('form-control');
    inputKep.value = mydata ? mydata.kepneve : '';
    let divKep = document.createElement('div');
    divKep.appendChild(labelKep);
    divKep.appendChild(inputKep);

    let button = document.createElement('button');
    button.innerText = 'Mentés';
    button.classList.add('btn');
    button.addEventListener('click', async () => {

        if (inputNev.value += "" && inputKiadasEve.value == "" && inputErtek.value == "" && inputKep.value == "") {
            
            alert('Sikeres mentés');
        let nev = inputNev.value;
        let kiadasEve = parseInt(inputKiadasEve.value);
        let ertekeles = parseInt(inputErtek.value);
        let kepneve = inputKep.value;
        let body = {id:myid ,nev:nev, kiadasEve:kiadasEve, ertekeles:ertekeles, kepneve: kepneve};

        if (mydata != null) {
            await myrequest(`http://localhost:5000/Konyv/${mydata.id}`, 'PUT', body);
        } else {
            await myrequest('http://localhost:5000/Konyv', 'POST', {nev, kiadasEve, ertekeles, kepneve});;
        }
    }
    else{
        alert('Minden mezőt ki kell tölteni');
    }

        
    });
    form.appendChild(divNev);
    form.appendChild(divKiadasEve);
    form.appendChild(divErtek);
    form.appendChild(divKep);
    form.appendChild(button);

    return form;
}

function CreateCard(data) {
    let card = document.createElement('div');
    card.classList.add('card');
    card.dataset.id = data.id;

    let = cardKonyvNeve = document.createElement('p');
    cardKonyvNeve.innerText = `Könyv neve: ${data.nev}`;
    cardKonyvNeve.classList.add('card-konyv-neve');
    card.appendChild(cardKonyvNeve);

    let cardKiadasEve = document.createElement('p');
    cardKiadasEve.innerText = `Kiadas eve: ${data.kiadasEve}`;
    cardKiadasEve.classList.add('card-kiadas-eve');
    card.appendChild(cardKiadasEve);

    let cardErtek = document.createElement('p');
    cardErtek.innerText = `Ertek: ${data.ertekeles}`;
    cardErtek.classList.add('card-ertek');
    card.appendChild(cardErtek);

    let cardImg = document.createElement('img');
    cardImg.src = data.kepneve;
    cardImg.classList.add('card-img');
    card.appendChild(cardImg);

    let cardFooter = document.createElement('div');

    let cardDelete = document.createElement('button');
    cardDelete.innerText = 'Delete';
    cardDelete.classList.add('card-delete');
    cardDelete.addEventListener('click', async () => {
        if (confirm('Biztosan törölni szeretnéd?')) {
            let id = card.dataset.id;
            await myrequest(`http://localhost:5000/Konyv/${id}`, 'DELETE')
            .then(window.location.reload());
        }
    });
    cardFooter.appendChild(cardDelete);

    let cardEdit = document.createElement('button');
    cardEdit.innerText = 'Edit';
    cardEdit.classList.add('card-edit');
    cardEdit.addEventListener('click', async () => {
        let id = card.dataset.id;
        let data = await myrequest(`http://localhost:5000/Konyv/${id}`, 'GET');
        await container.appendChild(CreateForm(data));

    });
    cardFooter.appendChild(cardEdit);

    card.appendChild(cardFooter);
    console.log(card);
    return card;
   
}

async function myrequest(URL, method, body) {
    let response = await fetch( URL, {
        method:method,
        body:body != null ? JSON.stringify(body) : null,
        headers: {
            'Content-Type': 'application/json'
        }
    }
    );
    let result = await response != null ?response.json() : null;
    return result;
};

async function getdATA() {
    return await myrequest("http://localhost:5000/Konyv", "GET")
}

