package main

import (
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

var clients = make(map[*websocket.Conn]bool) // connected clients
var broadcast = make(chan string)          // broadcast channel

// Configure the upgrader
var upgrader = websocket.Upgrader{}

// Define our message object
type Message struct {	
	Data  string `json:"data"`
}

func main() {
	fs := http.FileServer(http.Dir("frontend/dist"))
	http.Handle("/", fs)

	http.HandleFunc("/ws", handleConnections)

	go handleMessages()

	log.Println("http server started on :8000")
	err := http.ListenAndServe(":8000", nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}

func handleConnections(w http.ResponseWriter, r *http.Request) {
	upgrader.CheckOrigin = func(r *http.Request) bool { return true }
	ws, err := upgrader.Upgrade(w, r, nil)

	if err != nil {
		log.Fatal(err)
	}
	
	defer ws.Close()

	clients[ws] = true
	
	for {
		_, message,err := ws.ReadMessage()
		//var msg Message
		
		//err = ws.ReadJSON(&msg)
		
		if err != nil {
			log.Printf("error: %v", err)
			//delete(clients, ws)
			break
		} else {
			log.Println(string(message))
		}

		broadcast <- string(message)
	}
}

func handleMessages() {
	for {
		msg := <-broadcast
		for client := range clients {
			err := client.WriteJSON(msg)
			if err != nil {
				log.Printf("error: %v", err)
				client.Close()
				delete(clients, client)
			}
		}
	}
}
