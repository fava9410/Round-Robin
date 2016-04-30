$(document).ready(function(){
    $("#parar").hide();
    var tiemposRafaga = ["Tiempo Rafaga"], procesos = ["Proceso"], llegada = ["Tiempo de llegada"], tiempoFinalizacion = ["Tiempo de Finalizacion"], tiempoRetorno = ["Tiempo de Retorno"], tiempoEspera = ["Tiempo de Espera"], tiempoComienzo = ["Tiempo de Comienzo"];
    var nombresProcesos = ["A","B","C","D","E","F","G","H","I","J","K","L"];
    var nomcolores = ["Crimson","blue","green","brown","yellow","purple","magenta","gray","Coral","DarkGreen"];
    var colores = ["red","white"];
    var alea = 0, intervalo = 10, tamaño = 20, contador = 0, contadorProcesos = 0, quantum = 5;
    var matriz = [procesos,llegada,tiemposRafaga,tiempoComienzo,tiempoFinalizacion,tiempoRetorno,tiempoEspera];  
    var listos = [], ejecutando = [], bloqueados = [];

    $("#agregar").click(function(){
        $("#parar").show();
        contadorProcesos++;	
        agregarListos();	 
        llenarDatos();           
        pintar();
        pintar_numeros();
    });

    $("#parar").click(function(){
        ponerceros();
        bloqueados.push(ejecutando.shift());
        bloqueados[bloqueados.length-1].llegada = contador + 4;
        listos[0].llegada = contador;
        llenarDatos();
        ejecutando.push(listos.shift());

    });

    //$("#lienzo").css({"background-color":"black"});
    setInterval(proceso,1000);    

    function intercambio(){
        if(ejecutando != 0 && listos != 0 && ejecutando[0].rafaga!=0 && ejecutando[0].comienzo+quantum == contador){
            listos[0].llegada=contador;     
            listos.push(ejecutando.shift());
            llenarDatos();            
            ejecutando.push(listos.shift());
            pintar_numeros();
        }
    }

    function ponerceros(){
        ejecutando[0].comienzo = 0;
        ejecutando[0].finalizacion = 0;
        ejecutando[0].espera = 0;
        for(var i=0; i<procesos.length; i++){
            if(ejecutando[0].proceso == procesos[i]){
                tiempoComienzo[i] = 0;
                tiempoFinalizacion[i] = 0;
                tiempoEspera[i] = 0;
            }            
        }
    }

    function sacarbloqueados(){
        for(var i=0; i<bloqueados.length; i++){
            if(contador == bloqueados[i].llegada){
                listos.push(bloqueados.shift());
            }
        }
        llenarDatos();
    }

    function agregarListos(){    
        listos.push({"proceso": nombresProcesos[contadorProcesos-1], "llegada": contador, "rafaga": Math.round(Math.random()*8+4), "finalizacion": 0});  
        procesos.push(listos[listos.length-1].proceso);
        llegada.push(listos[listos.length-1].llegada);
        tiemposRafaga.push(listos[listos.length-1].rafaga);
        colores[procesos.length-1] = nomcolores[procesos.length-2];
        colores.push("white");
    }

    function llenarDatos(){    
        for(var i=0; i<listos.length; i++){
            if(i == 0){
                listos[0].finalizacion = listos[0].llegada + listos[0].rafaga;     
            }
            else {
                listos[i].finalizacion = listos[i-1].finalizacion + listos[i].rafaga; 
            }
            if(ejecutando!=0){        
                listos[0].finalizacion = ejecutando[0].finalizacion + listos[0].rafaga;        
            }        
            listos[i].retorno = listos[i].finalizacion-listos[i].llegada;
            listos[i].espera = listos[i].retorno-listos[i].rafaga;
            listos[i].comienzo = listos[i].llegada+listos[i].espera;   

            for(var j=1; j<procesos.length; j++){
                if(procesos[j] == listos[i].proceso){
                    tiempoComienzo[j] = listos[i].comienzo;
                    tiempoFinalizacion[j] = listos[i].finalizacion;
                    tiempoRetorno[j] = listos[i].retorno;
                    tiempoEspera[j] = listos[i].espera;
                }
            }
        }
        borrarTabla();
        dibujarTabla();
    }

    function dibujarTabla(){
        var body = document.getElementById("tabla");
        var tabla   = document.createElement("table");
        var tblBody = document.createElement("tbody");

        for (var j = 0; j < procesos.length; j++) {
            var hilera = document.createElement("tr");   
            for (var i = 0; i < matriz.length; i++){
                var celda = document.createElement("td");
                var textoCelda = document.createTextNode(matriz[i][j]);
                celda.appendChild(textoCelda);
                hilera.appendChild(celda);
            }   
            tblBody.appendChild(hilera);
        }     
        tabla.appendChild(tblBody);
        body.appendChild(tabla);
        tabla.setAttribute("border", "2");
    }

    function borrarTabla(){
        var tabla = $("#tabla").empty();
    }

    function proceso(){	
        if(ejecutando == 0 || contador == ejecutando[0].finalizacion){
            ejecutando[0] = listos.shift();
        }	   
        intercambio();
        pintar_procesos();  
        if(ejecutando != 0){
            ejecutando[0].rafaga--;
        }       
        if(bloqueados != 0){
            sacarbloqueados();
        }
        contador++;
    }

    function pintar(){
        var elemento = document.getElementById("lienzo");
        var lienzo = elemento.getContext('2d');          
        // DIBUJAR PROCESOS
        for(var i=1; i<procesos.length; i++){
            lienzo.fillStyle=colores[i];
            lienzo.fillRect(10,i*(tamaño+intervalo),tamaño,tamaño);
            lienzo.fillStyle = "white";
            lienzo.font = "20px Arial";
            lienzo.fillText(procesos[i],13,i*(tamaño+intervalo)+17);
        }    
    }
    function pintar_numeros(){
        var elemento = document.getElementById("lienzo");
        var lienzo = elemento.getContext('2d');     
        if(listos != 0){
            for(var i=0; i<=listos[listos.length-1].finalizacion; i++){
                lienzo.fillStyle = "black";
                lienzo.font = "20px Arial";
                lienzo.fillText(i, (i+1)*(tamaño+intervalo)+10, 15);
            }
        }    
    }
    function pintar_procesos(){   
        var elemento = document.getElementById("lienzo");
        var lienzo = elemento.getContext('2d');      
        for(var i=1; i<procesos.length; i++){ 
            if(contador >= tiempoComienzo[i] && contador<tiempoFinalizacion[i]){      
                lienzo.fillStyle = colores[i];              
            }
            else{
                if(llegada[i]>contador || contador>=tiempoFinalizacion[i]){       
                    lienzo.fillStyle = colores[colores.length-1];
                }
                else{
                    lienzo.fillStyle = colores[0];
                }
            }
            lienzo.fillRect((contador+1)*(tamaño+intervalo)+10, i*(tamaño+intervalo),tamaño,tamaño);       
        }
    }
});