const terminal = document.getElementById("terminal");

const lines = [
  "> Initializing portfolio...",
  "> Loading skills...",
  "> Connecting projects...",
  "> Ready."
];

let index = 0;

function typeLine(){
  if(index < lines.length){
    terminal.innerHTML += lines[index] + "<br>";
    index++;
    setTimeout(typeLine, 600);
  }
}

typeLine();
