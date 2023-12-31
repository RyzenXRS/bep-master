const tabelModalTetap = $("#tabel-modal-tetap");
const tabelModalKerja = $("#tabel-modal-kerja");
const tabelModalGaji = $("#tabel-modal-gaji");

let tabel = {
  barangModalTetap: [],
  barangModalKerja: [],
  barangModalGaji: [],
  laba: 0,
  jumlahProduk: 0,
  biayaPenyusutan: function () {
    return this.totalTetap() * ($("#persentase-penyusutan").value / 100);
  },
  totalTetap: function () {
    let container = 0;
    this.barangModalTetap.forEach(item => {
      container += item.total();
    });
    return container;
  },
  totalKerja: function () {
    let container = 0;
    this.barangModalKerja.forEach(item => {
      container += item.total();
    });
    return container;
  },
  totalGaji: function () {
    let container = 0;
    this.barangModalGaji.forEach (item => {
      container += item.total();
    });
    return container;
  },
  biayaPenyusutanTahunan: function () {
    return Math.ceil(this.biayaPenyusutan() / 30)
  },
  biayaKeseluruhan: function () {
    return (Math.ceil(this.biayaPenyusutanTahunan() / 1000) * 1000) + this.totalKerja() + this.totalGaji();
  },
  hargaJualPokok: function () {
    return (this.biayaKeseluruhan() / Number(this.jumlahProduk)) + (this.biayaKeseluruhan() / Number(this.jumlahProduk) * (Number(this.laba) / 100));
  },
  biayaGajiKaryawan: function () {
    return this.totalGaji();
  },
  labaBruto: function () {
    return (Math.ceil(tabel.hargaJualPokok() / 1000) * 1000) * this.jumlahProduk;
  },
  labaNetto: function () {
    return this.labaBruto() - this.biayaKeseluruhan();
  }
}

const tambahBarang = function (index, target, data, type) {
  const tr = document.createElement("tr");
  tr.innerHTML =
    `<tr>
      <td class="text-center">${index + 1}</td>
      <td colspan="4"><input placeholder="Nama Barang" id="nama-${type}" value="${data[index].namaBarang}"
          class="border-b-2 border-transparent w-full btn bg-transparent hover:border-gray-300 pl-2 focus:border-gray-500" type="text"></td>
      <td colspan="3"><input placeholder="Harga Barang" id="harga-${type}" value="${data[index].hargaBarang}"
          class="border-b-2 border-transparent w-full btn text-center bg-transparent hover:border-gray-300 focus:border-gray-500" type="number"></td>
      <td colspan="3"><input placeholder="Frekuensi" id="frekuensi-${type}" value="${data[index].frekuensi ? data[index].frekuensi : 1 }"
          class="border-b-2 border-transparent w-full btn text-center bg-transparent hover:border-gray-300 focus:border-gray-500" type="number"></td>
      <td colspan="3" id="total-baris-${type}">Rp ${data[index].total()},00</td>
      <td class="flex">
        <button id="hapus-${type}" class="mx-auto inline-block btn hover:text-red-600">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="fill-current w-6 text-gray-400 hover:text-red-500">
            <path d="M6 2l2-2h4l2 2h4v2H2V2h4zM3 6h14l-1 14H4L3 6zm5 2v10h1V8H8zm3 0v10h1V8h-1z"/>
          </svg>
        </button>
      </td>
    </tr>`
  target.appendChild(tr);
}

const renderModal = function(target, data) {
  target.innerHTML = "";
  let type = "";

  if (data === tabel.barangModalTetap) {
    type = "tetap";
  } else if (data === tabel.barangModalKerja) {
    type = "kerja";
  } else if (data === tabel.barangModalGaji) {
    type = "gaji";
  }

  data.forEach((barang, index) => {
    tambahBarang(index, target, data, type);
  });

  if (target === tabelModalTetap) {
    updateAttacher("tetap", tabel.barangModalTetap, target);
  } else if (target === tabelModalKerja) {
    updateAttacher("kerja", tabel.barangModalKerja, target);
  } else if (target === tabelModalGaji) {
    updateAttacher("gaji", tabel.barangModalGaji, target);
  }
}

const pushBarang = function(data) {
  data.push({ 
    namaBarang: '',
    hargaBarang: '',
    frekuensi: '',
    total: function () {
      return Number(this.hargaBarang) * Number(this.frekuensi);
    }
  });
  if (data === tabel.barangModalTetap) {
    renderModal(tabelModalTetap, data);
  } else if (data === tabel.barangModalKerja) {
    renderModal(tabelModalKerja, data);
  } else if (data === tabel.barangModalGaji) {
    renderModal(tabelModalGaji, data); // Changed from renderGaji to renderModal
  }
};

$("#tambah-barang-tetap").addEventListener('click', () => {
  pushBarang(tabel.barangModalTetap);
  $$("#nama-tetap")[ $$("#nama-tetap").length - 1].focus();
});
$("#tambah-barang-kerja").addEventListener('click', () => {
  pushBarang(tabel.barangModalKerja);
  $$("#nama-kerja")[ $$("#nama-kerja").length - 1].focus();
});
$("#tambah-barang-gaji").addEventListener('click', () => {
  pushBarang(tabel.barangModalGaji);
  $$("#nama-gaji")[ $$("#nama-gaji").length - 1].focus();
});


function updateBaris(index, data, target) {
  data[index].namaBarang = $$(`#nama-${target}`)[index].value;
  data[index].hargaBarang = $$(`#harga-${target}`)[index].value;
  data[index].frekuensi = $$(`#frekuensi-${target}`)[index].value;
  $$(`#total-baris-${target}`)[index].innerHTML = `Rp ${data[index].total()},00`;
  
  const totalBiaya = (data === tabel.barangModalTetap) ? tabel.totalTetap() :
                    (data === tabel.barangModalKerja) ? tabel.totalKerja() :
                    (data === tabel.barangModalGaji) ? tabel.totalGaji() :
                    0;  // Default to 0 if data type is unknown

  $(`#total-${target}`).innerHTML = `Total Biaya: Rp ${totalBiaya},00`;
  
  updatePenyusutan();
  updateKeseluruhan();
  updatePerencanaan();
  updateLaba();
}


const updateAttacher = function (target, data, table) {
  $$(`#nama-${target}`).forEach((item, index) => {
    item.addEventListener('input', () => updateBaris(index, data, target));
    $$(`#harga-${target}`)[index].addEventListener('input', () => updateBaris(index, data, target));
    $$(`#frekuensi-${target}`)[index].addEventListener('input', () => updateBaris(index, data, target));

    item.addEventListener('keyup', (e) => addByEnter(e, data, target));
    $$(`#harga-${target}`)[index].addEventListener('keyup', (e) => addByEnter(e, data, target));
    $$(`#frekuensi-${target}`)[index].addEventListener('keyup', (e) => addByEnter(e, data, target));
    
    $$(`#hapus-${target}`)[index].addEventListener('click', () => {
      hapusBaris(index, data);
      renderModal(table, data);
      $(`#total-${target}`).innerHTML = `Total Biaya: Rp ${tabel.totalTetap()},00`;
    })
  })
}

const updatePenyusutan = function () {
  $("#modal-penyusutan").innerHTML = tabel.totalTetap();
  $("#penyusutan").innerHTML = tabel.biayaPenyusutan();
  $("#penyusutan-tahun").innerHTML = Math.ceil(tabel.biayaPenyusutanTahunan() / 1000) * 1000;
}

const updateKeseluruhan = function () {
  $("#penyusutan-keseluruhan").innerHTML = Math.ceil(tabel.biayaPenyusutanTahunan() / 1000) * 1000;
  $("#kerja-keseluruhan").innerHTML = tabel.totalKerja();
  $("#biaya-keseluruhan").innerHTML = tabel.biayaKeseluruhan(); 
  $("#gaji-karyawan").innerHTML = tabel.biayaGajiKaryawan();
}

const updatePerencanaan = function () {
  $("#harga-produk").value = `Rp ${tabel.biayaKeseluruhan()},00`;
  tabel.laba = $("#laba").value;
  tabel.jumlahProduk = $("#jumlah-produk").value;
  $("#harga-jual-pokok").value = `Rp ${tabel.hargaJualPokok()},00`;
  $("#pembulatan-harga").value = `Rp ${Math.ceil(tabel.hargaJualPokok()/ 1000) * 1000},00`;
}

const updateLaba = function () {
  $("#laba-bruto").innerHTML = tabel.labaBruto();
  $("#bruto-pokok").innerHTML = Math.ceil(tabel.hargaJualPokok()/ 1000) * 1000;
  $("#jumlah-produk-bruto").innerHTML = tabel.jumlahProduk;
  $("#laba-netto").innerHTML = tabel.labaNetto();
  $("#bruto-netto").innerHTML = tabel.labaBruto();
  $("#netto-seluruh").innerHTML = tabel.biayaKeseluruhan();
}

$("#jumlah-produk").addEventListener('input', () => {
  updatePerencanaan();
  updateLaba();
});
$("#laba").addEventListener('input', () => {
  updatePerencanaan();
  updateLaba();
});

const hapusBaris = function (index, data) {
  data.splice(index, 1);
}

const addByEnter = function (event, data, target) {
  if (event.key === 'Enter') {
    pushBarang(data);
    $$(`#nama-${target}`)[$$(`#nama-${target}`).length - 1].focus();
  }
}
