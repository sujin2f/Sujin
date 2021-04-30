import { Background } from '../background'

const rawData01 = {
    desktop: 'http://sujinc.com/wp-content/uploads/2019/09/6.jpg',
    mobile: 'http://sujinc.com/wp-content/uploads/2019/09/6.jpg',
    title: '6',
}
const rawData02 = {
    desktop: 'http://sujinc.com/wp-content/uploads/2019/09/1-1024x683.jpg',
    mobile: 'http://sujinc.com/wp-content/uploads/2019/09/1-768x512.jpg',
    title: '1',
}
const rawData03 = {
    desktop: 'http://sujinc.com/wp-content/uploads/2019/09/5-1024x685.jpg',
    mobile: 'http://sujinc.com/wp-content/uploads/2019/09/5-768x514.jpg',
    title: '5',
}
const rawData04 = {
    desktop: 'http://sujinc.com/wp-content/uploads/2019/09/9.jpg',
    mobile: 'http://sujinc.com/wp-content/uploads/2019/09/9.jpg',
    title: '9',
}
const rawData05 = {
    desktop: 'http://sujinc.com/wp-content/uploads/2019/09/2-1024x682.jpg',
    mobile: 'http://sujinc.com/wp-content/uploads/2019/09/2-768x512.jpg',
    title: '2',
}
const rawData06 = {
    desktop: 'http://sujinc.com/wp-content/uploads/2019/09/8.jpg',
    mobile: 'http://sujinc.com/wp-content/uploads/2019/09/8.jpg',
    title: '8',
}
const rawData07 = {
    desktop: 'http://sujinc.com/wp-content/uploads/2019/09/4-1024x684.jpg',
    mobile: 'http://sujinc.com/wp-content/uploads/2019/09/4-768x513.jpg',
    title: '4',
}
const rawData08 = {
    desktop: 'http://sujinc.com/wp-content/uploads/2019/09/10-1024x683.jpg',
    mobile: 'http://sujinc.com/wp-content/uploads/2019/09/10-768x512.jpg',
    title: '10',
}
const rawData09 = {
    desktop: 'http://sujinc.com/wp-content/uploads/2019/09/7-1024x683.jpg',
    mobile: 'http://sujinc.com/wp-content/uploads/2019/09/7-768x512.jpg',
    title: '7',
}

export const rawData = [
    rawData01,
    rawData02,
    rawData03,
    rawData04,
    rawData05,
    rawData06,
    rawData07,
    rawData08,
    rawData09,
]

export const response = [
    new Background(rawData01),
    new Background(rawData02),
    new Background(rawData03),
    new Background(rawData04),
    new Background(rawData05),
    new Background(rawData06),
    new Background(rawData07),
    new Background(rawData08),
    new Background(rawData09),
]
