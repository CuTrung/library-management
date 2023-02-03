import { useState, useEffect } from "react";
import CardBook from "./cardBook";
import Carousel from "react-bootstrap/Carousel";

const CarouselLibrary = ({ listBooks }) => {
    const MAX_NEW_BOOKS_IN_CAROUSEL = import.meta.env.VITE_MAX_NEW_BOOKS_IN_CAROUSEL;
    const [listCarousel, setListCarousel] = useState([]);
    const totalCarousel = Math.ceil(MAX_NEW_BOOKS_IN_CAROUSEL / 4);

    // Chỉ lấy 12 books mới nhất
    useEffect(() => {
        let listData = [];
        for (let i = 0; i < totalCarousel; i++) {
            listData.push(listBooks.slice(i * 4, 4 * (i + 1)))
        }

        setListCarousel(listData);
    }, [listBooks]);


    return (
        <>
            <Carousel indicators={false} className="my-3">
                {listCarousel.length > 0 && listCarousel.map((carousel, index) => {
                    return (
                        <Carousel.Item key={`carouselItem-${index}`}>
                            <div className="row">
                                {carousel.length > 0 &&
                                    carousel.map((book, index) => {
                                        return (
                                            <CardBook
                                                key={`cardBook-${index}`}
                                                book={book}
                                                disabled={book.quantity - book.borrowed === 0}
                                            />
                                        );
                                    })}
                            </div>
                        </Carousel.Item>
                    )
                })}
                {/* <Carousel.Item>
                    <div className="row">
                        {listBooks.length > 0 &&
                            listBooks.slice(0, 4).map((book, index) => {
                                return (
                                    <CardBook
                                        key={`cardBook-${index}`}
                                        book={book}
                                        disabled={book.quantity - book.borrowed === 0}
                                    />
                                );
                            })}
                    </div>
                </Carousel.Item> */}
            </Carousel>
        </>
    );
};

export default CarouselLibrary;
