# Djava Tech

A static storefront for computers and electronics from brands like Apple, ASUS, Samsung, Dell, Lenovo, HP, Microsoft, Google, Sony, NVIDIA, AMD and Logitech.

## Features
- Product catalog with brand and category filters, live search, and sorting
- "Shop by brand" section
- Product detail modal with specs and quantity picker
- Cart drawer saved in the browser (localStorage), with shipping and tax totals
- Product illustrations for every item (`images/`, drawn by `tools/make_product_images.py`)
- Shipping to any country: the customer picks a country in the cart or at checkout, and
  shipping cost, delivery time and tax update automatically
- Demo checkout form (no payment is processed)
- Works on phones: swipeable categories, bottom-sheet product details,
  swipe to close the cart and product sheet, large tap targets, phone keyboards
  that match each field
- Installable as an app on phones (Add to Home Screen) and works offline
  when served over http/https
- Responsive layout with automatic dark mode

## Run
No build step. Open `index.html` in a browser, or serve the folder:

```sh
python3 -m http.server 8000
```

Installing the site as an app and using it offline only work when it is served over http or https, not opened as a file.

Products are stored in `products.js`.

Shipping prices, delivery times, zones and blocked countries are set in the `SHIPPING`
block near the top of `app.js`. Prices are examples; update them to your real prices before selling.

## Admin page
Open `admin.html` (live: https://djavdat090-dot.github.io/Djava/admin.html) to add, edit and delete
products, set sale prices, and upload product photos.

1. Create a GitHub fine-grained token at https://github.com/settings/personal-access-tokens/new
   with access to **only this repository** and **Contents: Read and write**.
2. On the admin page, paste the token and press **Connect**.
3. Make your changes, then press **Publish to store**. The admin page saves `products.js`
   (and any uploaded photos in `images/`) to the repository, and the live site updates in 1–2 minutes.

Unpublished changes are kept in your browser. Without a token you can still use
**Download products.js** and replace the file by hand.

The admin page has no password of its own: only someone with a GitHub token that can
write to this repository can change the store.

## Live site (GitHub Pages)
https://djavdat090-dot.github.io/Djava/

To publish: repository **Settings → Pages → Build and deployment → Source: Deploy from a branch**,
pick the branch with the site and the `/ (root)` folder, then **Save**. Updates go live
a minute or two after each push.
