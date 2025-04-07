document.addEventListener("alpine:init", () => {
  Alpine.data("products", () => ({
    items: [
      {
        id: 1,
        name: "Robusta Brazil ",
        img: "1.jpg",
        price: 20000,
        quantity: 0,
      },
      { id: 3, name: "Primo Passa ", img: "3.jpg", price: 30000, quantity: 0 },
      {
        id: 1,
        name: "Robusta Brazil ",
        img: "1.jpg",
        price: 20000,
        quantity: 0,
      },
      {
        id: 5,
        name: "Arabian Blend ",
        img: "5.jpg",
        price: 35000,
        quantity: 0,
      },
      {
        id: 1,
        name: "Robusta Brazil ",
        img: "1.jpg",
        price: 20000,
        quantity: 0,
      },
    ],
  }));

  Alpine.store("cart", {
    items: [],
    total: 0,
    quantity: 0,
    add(newItem) {
      // Cek apakah item sudah ada di cart
      const cartItem = this.items.find((item) => item.id === newItem.id);
      //jika belum ada
      if (!cartItem) {
        this.items.push({ ...newItem, quantity: 1, total: newItem.price });
        this.quantity++;
        this.total += newItem.price;
      } else {
        //jika barangnya sudah ada, cek apakah barang beda atau sama dengan yang ada di cart
        this.items = this.items.map((item) => {
          //jika barang berbeda
          if (item.id !== newItem.id) {
            return item;
          } else {
            //jika barang sudah ada, tambahkan quantity dan total
            item.quantity++;
            item.total = item.price * item.quantity;
            this.quantity++;
            this.total += item.price;
            return item;
          }
        });
      }
    },
    remove(id) {
      // ambil item yang mau di remove berdasarkan id
      const cartItem = this.items.find((item) => item.id === id);

      // jika item lebih dari 1
      if (cartItem.quantity > 1) {
        // telusuri 1
        this.items = this.items.map((item) => {
          // jika bukan barang yang di klik
          if (item.id !== id) {
            return item;
          } else {
            // jika barang yang di klik
            item.quantity--;
            item.total = item.price * item.quantity;
            this.quantity--;
            this.total -= item.price;
            return item;
          }
        });
      }
      // jika item hanya 1
      else if (cartItem.quantity === 1) {
        // hapus item dari cart
        this.items = this.items.filter((item) => item.id !== id);
        this.quantity--;
        this.total -= cartItem.price;
      }
    }, // Add a comma here if this is part of an object
  });
});

//form validation
const checkoutButton = document.querySelector(`.checkout-button`);
checkoutButton.disabled = true;

const form = document.querySelector(`#checkoutForm`);

form.addEventListener(`keyup`, function (e) {
  for (let i = 0; i < form.elements.length; i++) {
    if (form.elements[i].value.length !== 0) {
      checkoutButton.classList.remove(`disabled`);
      checkoutButton.classList.add(`disabled`);
    } else {
      return false;
    }
  }
  checkoutButton.disabled = false;
  checkoutButton.classList.remove(`disabled`);
});

// kirim data ketika tombol checkout di klik
checkoutButton.addEventListener(`click`, async function (e) {
  e.preventDefault();
  const formData = new FormData(form);
  const data = new URLSearchParams(formData);
  const objdata = Object.fromEntries(data);
  // const message = formatMessage(objData);
  // window.open(`http://wa.me/62/text=` + encodeURIComponent(message));
  // Kirim data ke server atau lakukan tindakan lain

  //minta transaction token ke server
  try{
    const response = await fetch('php/placeorder.php', {
    method: 'POST',
    body: data,
    });
    const token = await response.text();
  }catch (err) {
    console.log(err.message);
  }

  console.log(token);
  // window.snap.pay('TRANSACTION_TOKEN_HERE');

});

//format pesan whatsapp
const formatMessage = (obj) => {
  return `Data Customer
    Nama: ${obj.name}
    Email: ${obj.email}
    No HP: ${obj.phone}
Data Pesanan
${JSON.parsel(obj.items).map(
  (item) =>
    `${item.name} (${item.quantity} x ${rupiah(item.total)}) - ${
      item.quantity
    } x ${rupiah(item.price)} = ${rupiah(item.total)})\n`
)}
TOTAL: ${rupiah(obj.total)}
Terima kasih.`;
};

//konversi rupiah
const rupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};
