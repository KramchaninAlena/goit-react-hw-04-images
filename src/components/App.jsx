import { pixabayAPI } from "API/api";
import { ImageGallery } from "./ImageGallery/ImageGallery";
import { Searchbar } from "./Searchbar/Searchbar";
import React, { useEffect, useState } from 'react'
import { ImageGalleryItem } from "./ImageGalleryItem/ImageGalleryItem";
import { Loader } from "./Loader/Loader";
import { Button } from "./Button/Button";
import Modal from "./Modal/Modal";

export function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadMore, setIsLoadMore] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [largeImage, setLargeImage] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [images, setImages] = useState([]);
  const [perPage, setPerPage] = useState(12);
  const [page, setPage] = useState(1)
  const [totalHits, setTotalHits] = useState(0);

  useEffect(() => {
    if(!inputValue) return;
    async function fetchImages() {
       setIsLoading(true)
      //  setImages([])
      //  setPage(1)
      
      try {
        const { data } = await pixabayAPI(inputValue, page);
        console.log(data.totalHits)

        setImages((prevImages) => [...prevImages, ...data.hits]);
        setTotalHits(data);

        if( data.totalHits > perPage){
          setIsLoadMore(true)
              }else{
                setIsLoadMore(false)
              }
    } catch (error) {
        console.log(error);
      }finally {
        setIsLoading(false);
    }
    }
    fetchImages();
  }, [inputValue, page, perPage]);

  useEffect(() => {
    setImages([]);
    setPage(1);
  }, [inputValue]);

  const handleSearchForm = (inputValue) => {
    setInputValue(inputValue);
  };

  const handleClickBtn = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handleOpenModal = (e) => {
    setLargeImage(e.target.title);
    setModalIsOpen(true);
    window.addEventListener('keydown', handleKeyEsc);
  };

  const handleCloseModal = (e) => {
    if (e.currentTarget === e.target) {
      setModalIsOpen(false);
      window.removeEventListener('keydown', handleKeyEsc);
    }
  };

  const handleKeyEsc = (e) => {
    if (e.code === 'Escape') {
      setModalIsOpen(false);
      window.removeEventListener('keydown', handleKeyEsc);
    }
  };

  return (
    <>
      <Searchbar onSubmit={handleSearchForm} />
      <ImageGallery>
        {isLoading && <Loader />}
        {images.map(({ id, webformatURL, largeImageURL, tags }) => {
          return (
            <ImageGalleryItem
              key={id}
              webformatURL={webformatURL}
              largeImageURL={largeImageURL}
              tags={tags}
              handleOpenModal={handleOpenModal}
            />
          );
        })}
      </ImageGallery>
      {images.length > 0 && images.length < totalHits && (
        <Button onClick={handleClickBtn} />
      )}
      {modalIsOpen && (
        <Modal url={largeImage} handleCloseModal={handleCloseModal} />
      )}
    </>
  );
}



