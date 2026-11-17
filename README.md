# Djava Tech

A static storefront for computers and electronics: laptops, desktops, monitors, components, phones, audio, and accessories.

## Features
- Product catalog with category filters, live search, and sorting
- Product detail modal with specs and quantity picker
- Cart drawer saved in the browser (localStorage), with shipping and tax totals
- Demo checkout form (no payment is processed)
- Responsive layout with automatic dark mode

## Run
No build step. Open `index.html` in a browser, or serve the folder:

```sh
python3 -m http.server 8000
```

Products are defined in the `PRODUCTS` array at the top of `app.js`.
