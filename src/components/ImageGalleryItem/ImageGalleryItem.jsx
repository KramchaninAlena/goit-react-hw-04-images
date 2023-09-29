import css from './ImageGalleryItem.module.css'
export function ImageGalleryItem({ id, webformatURL, largeImageURL, tags, handleOpenModal}) {
    return (
        <li className={css.ImageGalleryItem} >
        <img key={id} src={webformatURL} alt={tags} title={largeImageURL} className={css['ImageGalleryItem-image']} onClick={handleOpenModal}/>
      </li>
      )
}



