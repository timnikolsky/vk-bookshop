import { GetStaticProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import Button from '../components/Button'
import books from '../books'
import Confetti from 'react-confetti'
import { motion, AnimatePresence, useAnimation } from "framer-motion"
import Lottie from "lottie-react"
import starEyes from '../starEyes.json'
import plural from '../lib/plural'
import useWindowSize from 'react-use/lib/useWindowSize'

const balance = 500

export default function Home({ books }) {
  const { width, height } = useWindowSize()
  const [booksAdded, setBooksAdded] = useState([] as number[])
  const [alertShown, setAlertShown] = useState(false)
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  })
  const balanceShakeControls = useAnimation()
  const balanceRef = useRef()
  const [modalOpened, setModalOpened] = useState(false)

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    window.addEventListener("resize", handleResize)
    handleResize()
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const booksAddedPrice = booksAdded
    .map(bookId => books.find(book => book.id === bookId).price)
    .reduce(function (a, b) {
      return a + b;
    }, 0)

  return (
    <>
      <div className="container">
        <main>
          <h1 className="block-title">Доступные книги</h1>
          <div className="books">
            {
              books.map((book, i) => (
                <motion.div
                  className="books__item" key={book.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 * i }}
                >
                  <Image
                    className="books__item-image"
                    src={book.image}
                    alt="Картинка книги"
                    width={64}
                    height={64}
                    layout="fixed"
                    quality={100}
                  />
                  <div className="books__item-info">
                    <h3 className="books__item-title">{book.name}</h3>
                    <span className="books__item-price">{book.price}₽</span>
                  </div>
                  <Button
                    onClick={() => {
                      if (balance - booksAddedPrice - book.price >= 0) {
                        setBooksAdded([...booksAdded, book.id])
                      } else {
                        setAlertShown(true)
                        window.scrollTo(0, 0)
                        balanceShakeControls.start({
                          scale: [1, 1.5, 1.5, 1],
                          color: ['#111', '#E00', '#E00', '#111'],
                          rotate: [0, -5, 5, -5, 5, -5, 5, -5, 5, -5, 5, -5, 5, -5, 5, -5, 5, 0],
                          transition: {
                            duration: 2,
                            times: [0, 0.1, 0.9, 1]
                          }
                        })
                      }
                    }}
                    disabled={!Boolean(book.amount - booksAdded.filter(id => id === book.id).length)}
                  >
                    Купить
                  </Button>
                </motion.div>
              ))
            }
          </div>
        </main>
        <aside>
          <h1 className="block-title">Личный кабинет</h1>
          <motion.div
            className="cart"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="cart__field">
              <svg className="cart__field-icon" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 8V24C5 24.5304 5.21071 25.0391 5.58579 25.4142C5.96086 25.7893 6.46957 26 7 26H27C27.2652 26 27.5196 25.8946 27.7071 25.7071C27.8946 25.5196 28 25.2652 28 25V11C28 10.7348 27.8946 10.4804 27.7071 10.2929C27.5196 10.1054 27.2652 10 27 10H7C6.46957 10 5.96086 9.78929 5.58579 9.41421C5.21071 9.03914 5 8.53043 5 8ZM5 8C5 7.46957 5.21071 6.96086 5.58579 6.58579C5.96086 6.21071 6.46957 6 7 6H24" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M22.5 19.5C23.3284 19.5 24 18.8284 24 18C24 17.1716 23.3284 16.5 22.5 16.5C21.6716 16.5 21 17.1716 21 18C21 18.8284 21.6716 19.5 22.5 19.5Z" fill="black" />
              </svg>
              <div className="cart__field-info">
                <h3 className="cart__field-title">Баланс</h3>
                <motion.span
                  animate={balanceShakeControls}
                  className="cart__field-text"
                  ref={balanceRef}
                >
                  {balance - booksAddedPrice}₽
                </motion.span>
              </div>
            </div>
            <div className="cart__field">
              <svg className="cart__field-icon" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 29C11.1046 29 12 28.1046 12 27C12 25.8954 11.1046 25 10 25C8.89543 25 8 25.8954 8 27C8 28.1046 8.89543 29 10 29Z" fill="black" />
                <path d="M23 29C24.1046 29 25 28.1046 25 27C25 25.8954 24.1046 25 23 25C21.8954 25 21 25.8954 21 27C21 28.1046 21.8954 29 23 29Z" fill="black" />
                <path d="M5.2875 9H27.7125L24.4125 20.55C24.2948 20.9692 24.0426 21.3381 23.6948 21.6001C23.3471 21.862 22.9229 22.0025 22.4875 22H10.5125C10.0771 22.0025 9.65293 21.862 9.30515 21.6001C8.95738 21.3381 8.70524 20.9692 8.5875 20.55L4.0625 4.725C4.0027 4.51594 3.8764 4.33207 3.70271 4.20125C3.52903 4.07042 3.31744 3.99977 3.1 4H1" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <div className="cart__field-info">
                <h3 className="cart__field-title">Корзина</h3>
                <span className="cart__field-text">
                  {
                    booksAdded.length
                      ? <>К оплате: {booksAdded.length} {plural(booksAdded.length, 'книга', 'книги', 'книг')} на сумму {booksAddedPrice}₽</>
                      : <>Корзина пуста</>
                  }
                </span>
              </div>
            </div>
            <div className="cart__actions">
              <Button
                disabled={!booksAdded.length}
                onClick={() => {
                  setModalOpened(true)
                }}
              >
                Оплата
              </Button>
              <Button
                disabled={!booksAdded.length}
                onClick={() => {
                  setBooksAdded([])
                  setAlertShown(false)
                }}
              >
                Очистить
              </Button>
            </div>
          </motion.div>
          <AnimatePresence>
            {
              alertShown &&
              <motion.div
                className="alert"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: .2 }}
              >
                Недостаточно средств для покупки!
              </motion.div>
            }
          </AnimatePresence>
        </aside>
      </div>
      <AnimatePresence>
        {
          modalOpened &&
          <motion.div
            className="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: .2 }}
          >
            <div className="modal">
              <div className="modal__content">
                <div className="modal__animation">
                  <Lottie
                    loop={false}
                    autoplay={true}
                    animationData={starEyes}
                    style={{ width: '16rem' }}
                    className="modal__animation"
                  />
                </div>
                <h3 className="modal__title">Поздравляем с покупкой!</h3>
                <p className="modal__text">Покупка прошла успешно, наслаждайтесь приобретёнными книгами!</p>
              </div>
              <button onClick={() => setModalOpened(false)} className="modal__button">
                Закрыть
              </button>
            </div>
            <Confetti
              width={width}
              height={height}
              colors={['#07F', '#50E3C2']}
              numberOfPieces={300}
            />
          </motion.div>
        }
      </AnimatePresence>
    </>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {
      books
    }
  }
}