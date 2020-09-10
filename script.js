$(document).ready(function(){
    let time= moment().format("h:mm:ss");
    let timeSplit = time.split(":"); 
    let minutesToRefresh= 59 - parseInt(timeSplit[1]); 
    let secondsToRefresh= 60- parseInt(timeSplit[2]); 
    let timeToRefresh= minutesToRefresh*60 + secondsToRefresh; 
    let secondsElapsed=0; 
    let timerUntilStartReloading= setInterval(function(){ 
        secondsElapsed++
        if (secondsElapsed === timeToRefresh){
            console.log(moment()); 
            let isReloading= confirm("Hour has passed, refresh?"); 
            if (isReloading) {
                window.location.reload(true);
            } else {
                alert("Refresh for reloading"); 
            }
        }
    },1000);
}); 

let timesArr= ["7AM","8AM", "9AM", "10AM", "11AM", "12PM", "1PM", "2PM", "3PM"]; 

for (let i=1; i<timesArr.length; i++){
    let newTimeBlockEL= $("#9AM").clone();
    newTimeBlockEL.attr("id", timesArr[i]); 
    newTimeBlockEL.children(".row").attr("style", "white-space: pre-Wrap"); 
    newTimeBlockEL.children(".row").children(".hour").text(timesArr[i]); 
    newTimeBlockEL.appendTo(".container"); 

}; 

let savedDayPlans;
let locationArr = []; 

function populateSavedEvents(){
    savedDayPlans= localStorage.getItem("savedDayPlans"); 
    locationArr=[]; 
    if (savedDayPlans === null || savedDayPlans=== "") {
        savedDayPlans = []; 
    } else {
        savedDayPlans = JSON.parse(savedDayPlans); 
        for (i=0; i<savedDayPlans.length; i++) {
            locationArr.push(savedDayPlans[i].time); 
        }
    }
    
    for (let i=0; i<locationArr.length; i++) {
        let timeBlockElid = "#"+locationArr[i]; 
        let timeBlockEl = $(timeBlockElid).children(".row").children("textarea"); 
        $(timeBlockElid).children(".row").children("button").attr("data-event", "yes"); 
        timeBlockEl.val(savedDayPlans[i].event); 
    }    
}

function removeEvent(index){
    locationArr.splice([index], 1); 
    savedDayPlans.splice([index],1); 
}

function clearEvent(isClear,index,location,buttonEl){
    if (isClear) {
        alert("This has been deleted");
        removeEvent(index); 
        buttonEl.attr("data-event", "none");  
        localStorage.setItem("savedDayPlans", JSON.stringify(savedDayPlans));
    }  else {
        location.val(savedDayPlans[index].event); 
        alert("Event not deleted"); 
    } 
    console.log("The data-event is set to "+buttonEl.attr("data-event") + " at " +buttonEl.siblings("p").text()); 
}

function changeEvent(time, index, location, buttonEl,eventInput, isPopulated){
    if (eventInput.trim() === "" && isPopulated === "yes"){
        let isSaved= confirm("At "+time+": Would you like to delete? '"+savedDayPlans[index].event+"' ?"); 
        clearEvent(isSaved,index,location, buttonEl); 
    } else if (eventInput.trim() !== "" && isPopulated ==="none"){
        let isSaved= confirm("At "+time+": Would you like to add? '"+eventInput+ "'?"); 
        if(isSaved) {
            saveEvent(time, eventInput); 
        }else {
             location.val(""); 
        }
    } else if (eventInput.trim() !== "" && isPopulated=== "yes"){
        if (savedDayPlans[index].event !== eventInput){     
            let isSaved= confirm("At "+time+": Change the event from '"+savedDayPlans[index].event+"' to '"+eventInput+"'?"); 
            if(isSaved) {
                removeEvent(index); 
                saveEvent(time, eventInput); 
            } else{
                alert("Change was not saved."); 
                location.val(savedDayPlans[index].event); 
            }
        }
     }
}

$(".time-block").delegate("button", "click", function(){
    event.preventDefault();
    let eventInput= $(this).siblings("textarea").val(); 
    let time= $(this).siblings("p").text(); 
    let location = $(this).siblings("textarea"); 
    let isPopulated= $(this).attr("data-event"); 
    let index= locationArr.indexOf(time);
    let buttonEl=$(this); 

    changeEvent(time, index, location, buttonEl, eventInput,isPopulated); 
    populateSavedEvents(); 
}); 
