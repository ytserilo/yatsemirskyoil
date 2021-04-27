package main

import (
  "net/http"
  "net/url"
  "html/template"
  "github.com/gorilla/mux"
  "encoding/json"
  "io"
  "os"

)
type ControlStruct struct{
  PageTitle string
  Products bool
  ProductInfo bool
  Keywords string
  Description string
  IndexType string
  Image string
}

type Product struct{
  PageTitle string
  Description string
  Keywords string
  Price float64
  Image string
  ProductInfo bool
  Products bool
  IndexType string
}

func getProduct(product_id string) Product{
  file, _ := os.Open("data.json")
  defer file.Close()

  data := make([]byte, 64)
  s := ""

  for{
      n, err := file.Read(data)
      if err == io.EOF{
          break
      }
      s += string(data[:n])
  }
  result_data := map[string]map[string]interface{}{}
  json.Unmarshal([]byte(s), &result_data)

  val, found := result_data[product_id]

  var prdct Product
  if found == false{
    prdct = Product{
      Products: true,
      PageTitle: "Эфирные масла от производителя",
      IndexType: "index, nofollow",
      Image: "/static/font.png",
      Keywords: "Эфирное масло, Yatsemirsky oil, Яцемирський эфирное масло",
      Description: "Эфирное масла 100% качество, бесплатная доставка, лучший выбор и низкие цены. Заказывайте!",
    }
  }else{
    prdct = Product{
      PageTitle: val["title"].(string),
      Price: val["price"].(float64),
      Image: val["img"].(string),
      Keywords: val["keywords"].(string),
      Description: val["description"].(string),
      ProductInfo: true,
      IndexType: "index, nofollow",
    }
  }

  return prdct
}

// 1747282321:AAH7NyAGh1AiwBJea0PI5aiiJddkBPmkX-8
// 1671962552:AAF1wbhTVZwVeuH2brY0ZOUQPuzmGylOSkw

func send_message(chat_id string, text string, bot_key string){
  link := "https://api.telegram.org/bot"+bot_key+"/sendMessage"
  response, _ := http.PostForm(link, url.Values{"chat_id": {chat_id}, "text": {text}})

  defer response.Body.Close()
}
func GetPort() string {
	var port = os.Getenv("PORT")
	// Set a default port if there is nothing in the environment
	if port == "" {
		port = "4747"

	}
	return ":" + port
}

func main(){
  router := mux.NewRouter()


  router.HandleFunc("/question/", func(w http.ResponseWriter, r *http.Request){
    if r.Method == "POST"{
      data := r.FormValue("data")
      request_data := map[string]interface{}{}
      err := json.Unmarshal([]byte(data), &request_data)

      if err != nil{
        return
      }
      text := ""
      text += "Email: "+request_data["email"].(string)
      text += "\nПитання: "+request_data["question"].(string)

      send_message("680730382", text, "1747282321:AAH7NyAGh1AiwBJea0PI5aiiJddkBPmkX-8")
    }
  })

  router.HandleFunc("/create_order/", func(w http.ResponseWriter, r *http.Request){
    if r.Method == "POST"{

      data := r.FormValue("data")
      request_data := map[string]interface{}{}
      err := json.Unmarshal([]byte(data), &request_data)

      if err != nil{
        return
      }
      text := ""
      text += "Оплата: " + request_data["payment"].(string)
      text += "\nТип доставки: " + request_data["delivery-type"].(string)
      text += "\nНомер телефона: " + request_data["phone-number"].(string)
      text += "\nГород: " + request_data["city-name"].(string) + " " + request_data["address"].(string)
      text += "\nОтделение: " + request_data["warehouse"].(string)
      text += "\nЦена: " + request_data["price"].(string)
      text += "\nИмя товара: " + request_data["product-title"].(string)

      send_message("680730382", text, "1671962552:AAF1wbhTVZwVeuH2brY0ZOUQPuzmGylOSkw")
      // send data to telegram messanger
    }
  })
  router.HandleFunc("/product_id/{product_id}", func(w http.ResponseWriter, r *http.Request){
    if r.Method == "GET"{
      vars := mux.Vars(r)
      product_id := vars["product_id"]

      prdct := getProduct(product_id)

      files := []string{
       "templates/home.page.tmpl",
       "templates/base.layout.tmpl",
      }
      ts, _ := template.ParseFiles(files...)
      ts.Execute(w, prdct)
      // return html data
    }else if r.Method == "POST"{
      vars := mux.Vars(r)
      product_id := vars["product_id"]

      prdct := getProduct(product_id)

      tmpl, _ := template.ParseFiles("templates/product_info.html")
      tmpl.Execute(w, prdct)
    }

  })

  router.HandleFunc("/products", func(w http.ResponseWriter, r *http.Request){
    if r.Method == "GET"{
      files := []string{
       "templates/home.page.tmpl",
       "templates/base.layout.tmpl",
     }
     data := ControlStruct{
       Image: "/static/font.png",
       PageTitle: "Эфирные масла от производителя",
       Products: true,
       IndexType: "index, nofollow",
       Keywords: "Эфирное масло, Yatsemirsky oil, Яцемирський эфирное масло",
       Description: "Эфирное масла 100% качество, бесплатная доставка, лучший выбор и низкие цены. Заказывайте!",
     }
     ts, _ := template.ParseFiles(files...)
     ts.Execute(w, data)
    }else if r.Method == "POST"{
      http.ServeFile(w, r, "templates/products.html")
    }

  })

  router.HandleFunc("/static/{name}", func(w http.ResponseWriter, r *http.Request){
    vars := mux.Vars(r)
    name := vars["name"]

    http.ServeFile(w, r, "static/"+name)
  })
  router.HandleFunc("/{file_name}", func(w http.ResponseWriter, r *http.Request){
    vars := mux.Vars(r)
    file_name := vars["file_name"]

    if file_name == "sw.js"{
      http.ServeFile(w, r, "static/sw.js")
    }
  })
  router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request){
    files := []string{
     "templates/home.page.tmpl",
     "templates/base.layout.tmpl",
    }
    data := ControlStruct{
     Image: "/static/font.png",
     PageTitle: "Эфирные масла",
     Keywords: "Эфирное масло, Yatsemirsky oil, Яцемирський эфирное масло",
     IndexType: "index, nofollow",
     Description: "Эфирное масла 100% качество, бесплатная доставка, лучший выбор и низкие цены. Заказывайте!",
    }
    ts, _ := template.ParseFiles(files...)
    ts.Execute(w, data)
  })

  http.Handle("/",router)
  http.ListenAndServe(GetPort(), nil)
}
