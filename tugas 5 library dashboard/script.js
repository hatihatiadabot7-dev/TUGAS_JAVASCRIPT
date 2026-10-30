document.addEventListener("DOMContentLoaded", () => {
  const categories = [
    { id: "MAKANAN", name: "Makanan", loz: "blue" },
    { id: "MINUMAN", name: "Minuman", loz: "green" },
    { id: "SNACK", name: "Snack", loz: "purple" },
  ];

  let rawProducts = [
    { id: "p1", name: "Nasi Goreng", cat: "MAKANAN", price: 15000, sold: 33 },
    { id: "p2", name: "Mie Ayam", cat: "MAKANAN", price: 14000, sold: 35 },
    { id: "p3", name: "Nasi Ayam", cat: "MAKANAN", price: 17000, sold: 23 },
    { id: "p4", name: "Es Teh Manis", cat: "MINUMAN", price: 4000, sold: 42 },
    { id: "p5", name: "Keripik Singkong", cat: "SNACK", price: 6000, sold: 18 },
    { id: "p6", name: "Air Mineral", cat: "MINUMAN", price: 4000, sold: 23 },
    { id: "p7", name: "Susu Kotak", cat: "MINUMAN", price: 6000, sold: 12 },
  ];

  // Populate Category Filter Options
  const fKatSelect = document.getElementById("fKat");
  categories.forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c.id;
    opt.textContent = c.name;
    opt.selected = true;
    fKatSelect.appendChild(opt);
  });

  const tomSelectKat = new TomSelect("#fKat", {
    plugins: ["remove_button"],
    persist: false,
    create: false,
  });

  // Flatpickr Date Range Picker
  const fp = flatpickr("#fDate", {
    mode: "range",
    locale: "id",
    dateFormat: "Y-m-d",
    defaultDate: ["2026-10-17", "2026-10-23"],
    onChange: function (selectedDates) {
      if (selectedDates.length === 2) {
        updateDashboard();
      }
    },
  });

  document.getElementById("dRange").textContent = "17 Okt 2026 - 23 Okt 2026 · 3 kategori · 10 produk";

  // Initialize Charts
  const ctxBar = document.getElementById("cBar").getContext("2d");
  const barChart = new Chart(ctxBar, {
    type: "bar",
    data: {
      labels: ["Sen, 17", "Sel, 18", "Rab, 19", "Kam, 20", "Jum, 21", "Sab, 22", "Min, 23"],
      datasets: [
        {
          label: "Omzet",
          data: [195000, 210000, 180000, 250000, 220000, 195000, 160000],
          backgroundColor: "#357DE8",
          borderRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, grid: { color: "rgba(200,200,200,0.1)" } },
        x: { grid: { display: false } },
      },
    },
  });

  const ctxDn = document.getElementById("cDn").getContext("2d");
  const donutChart = new Chart(ctxDn, {
    type: "doughnut",
    data: {
      labels: categories.map((c) => c.name),
      datasets: [
        {
          data: [91, 77, 18],
          backgroundColor: ["#357DE8", "#82B536", "#BF63F3"],
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: "bottom" } },
      cutout: "70%",
    },
  });

  // Tabulator Table
  const table = new Tabulator("#tProd", {
    data: rawProducts,
    layout: "fitColumns",
    pagination: "local",
    paginationSize: 5,
    columns: [
      { title: "Produk", field: "name", widthGrow: 2, headerFilter: "input" },
      {
        title: "Kategori",
        field: "cat",
        widthGrow: 1.5,
        formatter: (cell) => {
          const val = cell.getValue();
          const catObj = categories.find((c) => c.id === val);
          return `<span class="lozenge ${catObj ? catObj.loz : "blue"}">${catObj ? catObj.name : val}</span>`;
        },
      },
      { title: "Terjual", field: "sold", hozAlign: "right", sorter: "number", widthGrow: 1, formatter: (cell) => `<span class="num">${cell.getValue()}</span>` },
      {
        title: "Omzet",
        field: "price",
        hozAlign: "right",
        formatter: (cell) => {
          const data = cell.getData();
          const total = data.price * data.sold;
          return `<span class="num">Rp ${total.toLocaleString("id-ID")}</span>`;
        },
        widthGrow: 1.5,
      },
      {
        title: "",
        formatter: () => `<button class="icon-btn del" type="button" title="Hapus"><svg class="ic" viewBox="0 0 24 24"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>`,
        width: 50,
        hozAlign: "center",
        cellClick: (e, cell) => {
          const rowData = cell.getRow().getData();
          Swal.fire({
            title: `<svg class="ic" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg> Hapus ${rowData.name}?`,
            html: "Tindakan ini tidak dapat dihapus dari laporan.<br>Produk akan dihapus permanen.",
            showCancelButton: true,
            confirmButtonText: "Hapus",
            cancelButtonText: "Batal",
            customClass: {
              popup: "ads-modal",
              confirmButton: "btn danger",
              cancelButton: "btn subtle",
            },
            buttonsStyling: false,
          }).then((result) => {
            if (result.isConfirmed) {
              cell.getRow().delete();
              Swal.fire({
                toast: true,
                position: "top-end",
                icon: "success",
                title: "Produk berhasil dihapus",
                showConfirmButton: false,
                timer: 2000,
                customClass: { popup: "ads-flag" },
              });
            }
          });
        },
      },
    ],
  });

  table.on("dataLoaded", (data) => {
    document.getElementById("tCount").textContent = `${data.length} produk`;
  });
  document.getElementById("tCount").textContent = `${rawProducts.length} produk`;

  // Promo List
  const promos = [
    { name: "Paket Hemat", desc: "Mie Ayam cuma Rp12.000", badge: "Diskon", color: "yellow", emoji: "🍜" },
    { name: "Paket Sarapan", desc: "Nasi Goreng + Es Teh Manis", badge: "Setengah Hari", color: "teal", emoji: "🍳" },
    { name: "Menu Baru", desc: "Pisang Goreng Sambal", badge: "Baru", color: "red", emoji: "🍌" },
    { name: "Jumat Berkah", desc: "Es Teh Gratis bagi yang membeli makanan", badge: "Jumat", color: "blue", emoji: "🎁" },
  ];

  const promoList = document.getElementById("promo");
  promos.forEach((p) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="p-emoji" style="background:var(--ds-background-neutral)">${p.emoji}</div>
      <div class="p-body">
        <b>${p.name}</b>
        <small>${p.desc}</small>
      </div>
      <span class="lozenge ${p.color}">${p.badge}</span>
    `;
    promoList.appendChild(li);
  });
  document.getElementById("pCount").textContent = `${promos.length} aktif`;

  // Initial KPI values
  function updateDashboard() {
    const selectedCats = tomSelectKat.getValue();
    const multiplier = selectedCats.length / categories.length || 0.5;

    const omzet = Math.round(1410000 * multiplier);
    const soldItems = Math.round(261 * multiplier);
    const trx = Math.round(21 * multiplier);

    document.getElementById("kOmzet").textContent = `Rp ${omzet.toLocaleString("id-ID")}`;
    document.getElementById("cOmzet").textContent = `Rata-rata Rp ${Math.round(omzet / 7).toLocaleString("id-ID")} per hari`;

    document.getElementById("kItem").textContent = soldItems;
    document.getElementById("cItem").textContent = `Dari ${rawProducts.length} produk yang aktif`;

    document.getElementById("kTrx").textContent = trx;
    document.getElementById("cTrx").textContent = `Catatan transaksi`;
  }
  updateDashboard();

  // Theme Toggle Handler
  const btnTheme = document.getElementById("btnTheme");
  btnTheme.addEventListener("click", () => {
    const currentMode = document.documentElement.getAttribute("data-color-mode");
    const newMode = currentMode === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-color-mode", newMode);
    try {
      localStorage.setItem("kantin-color-mode", newMode);
    } catch (e) {}
    btnTheme.querySelector("span").textContent = newMode === "dark" ? "Mode terang" : "Mode gelap";
  });

  // Floating UI Tooltip Handler
  const tooltip = document.getElementById("tooltip");
  document.querySelectorAll("[data-tip]").forEach((btn) => {
    btn.addEventListener("mouseenter", (e) => {
      tooltip.textContent = btn.getAttribute("data-tip");
      tooltip.style.opacity = "1";
      FloatingUIDOM.computePosition(btn, tooltip, {
        placement: "top",
        middleware: [FloatingUIDOM.offset(6), FloatingUIDOM.shift()],
      }).then(({ x, y }) => {
        Object.assign(tooltip.style, {
          left: `${x}px`,
          top: `${y}px`,
        });
      });
    });
    btn.addEventListener("mouseleave", () => {
      tooltip.style.opacity = "0";
    });
  });
});
