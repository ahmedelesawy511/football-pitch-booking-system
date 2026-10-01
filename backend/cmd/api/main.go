package main

import (
	"net/http"
)

func main() {
	mux := http.NewServeMux()

	http.ListenAndServe("0.0.0.0:3000", mux)
}
