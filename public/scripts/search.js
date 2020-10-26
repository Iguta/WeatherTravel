let searchFrm = document.getElementById('searchForm');
let searchBttn = document.getElementById('search-bttn');
let geoSearch = document.getElementById('geo-search');

let searchPlace = document.getElementById('searchPlace');


searchBttn.addEventListener('click', ()=> {
    let address = searchFrm.elements['searchPlace'].value;
    if(address){
        fetch(`http://api.positionstack.com/v1/forward?access_key=f8ed520e1d4cedd903e3f0357540bd83&query=${address}`)
        .then(response => response.json())
        .then(response => {
        if(response.data.length>0){
            let data = `${response.data[0].latitude} ${response.data[0].longitude}`;
            searchFrm.elements['searchPlace'].value = data;
            searchPlace.innerHTML = response.data[0].label;
            searchFrm.submit();
        }
        else{
            alert("An invalid place...");
        }
        })
        .catch(error => console.log(error));   
    }
    else{
        alert("Please fill out this field...");
    }
     
});
geoSearch.addEventListener('click', ()=> {
    let data=null;
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition( (position)=>{
            data = `${position.coords.latitude} ${position.coords.longitude}`;
            fetch(`http://api.positionstack.com/v1/reverse?access_key=f8ed520e1d4cedd903e3f0357540bd83&query=${position.coords.latitude},${position.coords.longitude}`)
            .then(response => response.json())
            .then(response => {
                if (response.data.length>0){
                    searchPlace.innerHTML = response.data[0].label;
                }
            })
            searchFrm.elements['searchPlace'].value = data;
            searchFrm.submit();
        }, 
        (error)=>{
            alert(error.message);
        } );
    };
    // console.log('clicked...');
});

