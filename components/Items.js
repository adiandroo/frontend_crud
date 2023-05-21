/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';
import { api } from '../pages/_app';
import Image from 'next/image';

const Items = () => {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    foto: null,
    nama: '',
    hargaBeli: '',
    hargaJual: '',
    stok: ''
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editItemId, setEditItemId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get('/items');
      setItems(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const [image, setImage] = useState(null);
  const [createObjectURL, setCreateObjectURL] = useState(null);

  const uploadToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];

      setImage(i);
      setCreateObjectURL(URL.createObjectURL(i));
    }
  };

  const handleInputChange = (e) => {
    uploadToClient(e)
    const { name, value, files } = e.target;
    if (name === 'foto') {
      setFormData((prevState) => ({
        ...prevState,
        foto: files[0]
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData.foto, 'photo');
    try {
      if (
        formData.nama &&
        formData.hargaBeli !== '' &&
        formData.hargaJual !== '' &&
        formData.stok !== ''
      ) {
        const itemData = new FormData();
        
        if (formData.foto) {
          itemData.append('foto', formData.foto);
        }
        
        itemData.append('nama', formData.nama);
        itemData.append('hargaBeli', formData.hargaBeli);
        itemData.append('hargaJual', formData.hargaJual);
        itemData.append('stok', formData.stok);
  
        if (isEdit) {
          const response = await api.put(`/items/${editItemId}`, itemData);
          console.log(response);
        } else {
          const response = await api.post('/items', itemData);
          console.log(response);
        }
  
        setFormData({
          foto: createObjectURL,
          nama: '',
          hargaBeli: '',
          hargaJual: '',
          stok: ''
        });
        setIsFormOpen(false);
        setIsEdit(false);
        fetchData();
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleEdit = (item) => {
    setFormData({
      foto: createObjectURL,
      nama: item.nama,
      hargaBeli: item.harga_beli,
      hargaJual: item.harga_jual,
      stok: item.stok
    });
    setIsEdit(true);
    setEditItemId(item.id);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/items/${id}`);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(items.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredItems = items.filter((item) =>
    item.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const searchedItems = searchTerm !== '' ? filteredItems : items;
  const currentSearchedItems = searchedItems.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{isEdit ? 'Edit' : 'CRUD'} Data Barang</h1>
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-4"
        onClick={() => {
          setIsFormOpen(true);
          setIsEdit(false);
        }}
      >
        Tambah Barang
      </button>

      {isFormOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow">
            <h2 className="text-2xl font-bold mb-4">{isEdit ? 'Edit' : 'Tambah'} Barang</h2>

            <div className="mb-4">
              <label htmlFor="foto" className="block font-bold mb-1">
                Foto Barang
              </label>
              <input
                type="file"
                id="foto"
                name="foto"
                accept=".jpg,.jpeg,.png"
                className="border border-gray-300 px-4 py-2 rounded w-full"
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="nama" className="block font-bold mb-1">
                Nama Barang
              </label>
              <input
                type="text"
                id="nama"
                name="nama"
                value={formData.nama}
                onChange={handleInputChange}
                className="border border-gray-300 px-4 py-2 rounded w-full"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="hargaBeli" className="block font-bold mb-1">
                Harga Beli
              </label>
              <input
                type="number"
                id="hargaBeli"
                name="hargaBeli"
                value={formData.hargaBeli}
                onChange={handleInputChange}
                className="border border-gray-300 px-4 py-2 rounded w-full"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="hargaJual" className="block font-bold mb-1">
                Harga Jual
              </label>
              <input
                type="number"
                id="hargaJual"
                name="hargaJual"
                value={formData.hargaJual}
                onChange={handleInputChange}
                className="border border-gray-300 px-4 py-2 rounded w-full"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="stok" className="block font-bold mb-1">
                Stok
              </label>
              <input
                type="number"
                id="stok"
                name="stok"
                value={formData.stok}
                onChange={handleInputChange}
                className="border border-gray-300 px-4 py-2 rounded w-full"
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                onClick={() => {
                  setIsFormOpen(false);
                  setIsEdit(false);
                }}
              >
                Batal
              </button>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                {isEdit ? 'Simpan Perubahan' : 'Tambah'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mb-4">
        <input
          type="text"
          placeholder="Cari barang..."
          className="border border-gray-300 px-4 py-2 rounded w-full"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <table className="w-full border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Foto</th>
            <th className="border border-gray-300 px-4 py-2">Nama</th>
            <th className="border border-gray-300 px-4 py-2">Harga Beli</th>
            <th className="border border-gray-300 px-4 py-2">Harga Jual</th>
            <th className="border border-gray-300 px-4 py-2">Stok</th>
            <th className="border border-gray-300 px-4 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {currentSearchedItems.map((item) => (
            <tr key={item.id}>
              <td className="border border-gray-300 px-4 py-2 text-center items-center">
                <Image
                  src={item.foto ? item.foto : '/src/image/image.jpg' }
                  width={20}
                  height={20}
                  alt={item.name}
                  className='flex content-center w-full'
                />
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">{item.nama}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{item.harga_beli}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{item.harga_jual}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{item.stok}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                <button
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-2 rounded mr-2"
                  onClick={() => handleEdit(item)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded"
                  onClick={() => handleDelete(item.id)}
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ul className="flex justify-center mt-4">
        {pageNumbers.map((pageNumber) => (
          <li key={pageNumber}>
            <button
              className={`border border-gray-300 px-4 py-2 rounded ${
                pageNumber === currentPage ? 'bg-gray-300' : ''
              }`}
              onClick={() => handlePageChange(pageNumber)}
            >
              {pageNumber}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Items;
