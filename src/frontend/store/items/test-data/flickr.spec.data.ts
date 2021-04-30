import { Flickr } from '../flickr'

const rawData01 = {
    link: 'https://www.flickr.com/photos/ming-zoo/27542554804/',
    media: {
        origin: 'https://live.staticflickr.com/7358/27542554804_2b49117bdf.jpg',
        s: 'https://live.staticflickr.com/7358/27542554804_2b49117bdf_s.jpg',
        t: 'https://live.staticflickr.com/7358/27542554804_2b49117bdf_t.jpg',
        b: 'https://live.staticflickr.com/7358/27542554804_2b49117bdf_b.jpg',
        m: 'https://live.staticflickr.com/7358/27542554804_2b49117bdf_m.jpg',
    },
    title: 'Toronto Pride 2016',
}
const rawData02 = {
    link: 'https://www.flickr.com/photos/ming-zoo/27542550264/',
    media: {
        origin: 'https://live.staticflickr.com/7389/27542550264_eee5e2ac11.jpg',
        s: 'https://live.staticflickr.com/7389/27542550264_eee5e2ac11_s.jpg',
        t: 'https://live.staticflickr.com/7389/27542550264_eee5e2ac11_t.jpg',
        b: 'https://live.staticflickr.com/7389/27542550264_eee5e2ac11_b.jpg',
        m: 'https://live.staticflickr.com/7389/27542550264_eee5e2ac11_m.jpg',
    },
    title: 'Toronto Pride 2016',
}
const rawData03 = {
    link: 'https://www.flickr.com/photos/ming-zoo/28123949876/',
    media: {
        origin: 'https://live.staticflickr.com/7569/28123949876_e79b55f46a.jpg',
        s: 'https://live.staticflickr.com/7569/28123949876_e79b55f46a_s.jpg',
        t: 'https://live.staticflickr.com/7569/28123949876_e79b55f46a_t.jpg',
        b: 'https://live.staticflickr.com/7569/28123949876_e79b55f46a_b.jpg',
        m: 'https://live.staticflickr.com/7569/28123949876_e79b55f46a_m.jpg',
    },
    title: 'Toronto Pride 2016',
}
const rawData04 = {
    link: 'https://www.flickr.com/photos/ming-zoo/42979886814/',
    media: {
        origin: 'https://live.staticflickr.com/934/42979886814_20efbc6cec.jpg',
        s: 'https://live.staticflickr.com/934/42979886814_20efbc6cec_s.jpg',
        t: 'https://live.staticflickr.com/934/42979886814_20efbc6cec_t.jpg',
        b: 'https://live.staticflickr.com/934/42979886814_20efbc6cec_b.jpg',
        m: 'https://live.staticflickr.com/934/42979886814_20efbc6cec_m.jpg',
    },
    title: '170428',
}
const rawData05 = {
    link: 'https://www.flickr.com/photos/ming-zoo/24303436911/',
    media: {
        origin: 'https://live.staticflickr.com/1596/24303436911_b3b349276d.jpg',
        s: 'https://live.staticflickr.com/1596/24303436911_b3b349276d_s.jpg',
        t: 'https://live.staticflickr.com/1596/24303436911_b3b349276d_t.jpg',
        b: 'https://live.staticflickr.com/1596/24303436911_b3b349276d_b.jpg',
        m: 'https://live.staticflickr.com/1596/24303436911_b3b349276d_m.jpg',
    },
    title:
        '\u1102\u1165\u1102\u1161 \u1106\u1165\u11a8\u110b\u1165\u1105\u1161 \u110c\u1175\u11af\u1109\u1169',
}
const rawData06 = {
    link: 'https://www.flickr.com/photos/ming-zoo/24018106779/',
    media: {
        origin: 'https://live.staticflickr.com/1676/24018106779_3c70aae2e8.jpg',
        s: 'https://live.staticflickr.com/1676/24018106779_3c70aae2e8_s.jpg',
        t: 'https://live.staticflickr.com/1676/24018106779_3c70aae2e8_t.jpg',
        b: 'https://live.staticflickr.com/1676/24018106779_3c70aae2e8_b.jpg',
        m: 'https://live.staticflickr.com/1676/24018106779_3c70aae2e8_m.jpg',
    },
    title: '\u1109\u1162\u110b\u1167\u11ab\u1100\u116d',
}
const rawData07 = {
    link: 'https://www.flickr.com/photos/ming-zoo/28123938286/',
    media: {
        origin: 'https://live.staticflickr.com/7782/28123938286_2753a3a2e2.jpg',
        s: 'https://live.staticflickr.com/7782/28123938286_2753a3a2e2_s.jpg',
        t: 'https://live.staticflickr.com/7782/28123938286_2753a3a2e2_t.jpg',
        b: 'https://live.staticflickr.com/7782/28123938286_2753a3a2e2_b.jpg',
        m: 'https://live.staticflickr.com/7782/28123938286_2753a3a2e2_m.jpg',
    },
    title: 'Toronto Pride 2016',
}
const rawData08 = {
    link: 'https://www.flickr.com/photos/ming-zoo/28594697610/',
    media: {
        origin: 'https://live.staticflickr.com/8496/28594697610_2c515f969b.jpg',
        s: 'https://live.staticflickr.com/8496/28594697610_2c515f969b_s.jpg',
        t: 'https://live.staticflickr.com/8496/28594697610_2c515f969b_t.jpg',
        b: 'https://live.staticflickr.com/8496/28594697610_2c515f969b_b.jpg',
        m: 'https://live.staticflickr.com/8496/28594697610_2c515f969b_m.jpg',
    },
    title: 'Police, Toronto',
}
const rawData09 = {
    link: 'https://www.flickr.com/photos/ming-zoo/31184254236/',
    media: {
        origin: 'https://live.staticflickr.com/5679/31184254236_2441f60a94.jpg',
        s: 'https://live.staticflickr.com/5679/31184254236_2441f60a94_s.jpg',
        t: 'https://live.staticflickr.com/5679/31184254236_2441f60a94_t.jpg',
        b: 'https://live.staticflickr.com/5679/31184254236_2441f60a94_b.jpg',
        m: 'https://live.staticflickr.com/5679/31184254236_2441f60a94_m.jpg',
    },
    title: 'Niagara Falls',
}
const rawData10 = {
    link: 'https://www.flickr.com/photos/ming-zoo/31208304605/',
    media: {
        origin: 'https://live.staticflickr.com/5450/31208304605_6f5664b0ef.jpg',
        s: 'https://live.staticflickr.com/5450/31208304605_6f5664b0ef_s.jpg',
        t: 'https://live.staticflickr.com/5450/31208304605_6f5664b0ef_t.jpg',
        b: 'https://live.staticflickr.com/5450/31208304605_6f5664b0ef_b.jpg',
        m: 'https://live.staticflickr.com/5450/31208304605_6f5664b0ef_m.jpg',
    },
    title: 'Niagara Forms',
}
const rawData11 = {
    link: 'https://www.flickr.com/photos/ming-zoo/27876992670/',
    media: {
        origin: 'https://live.staticflickr.com/7652/27876992670_43d3fc224f.jpg',
        s: 'https://live.staticflickr.com/7652/27876992670_43d3fc224f_s.jpg',
        t: 'https://live.staticflickr.com/7652/27876992670_43d3fc224f_t.jpg',
        b: 'https://live.staticflickr.com/7652/27876992670_43d3fc224f_b.jpg',
        m: 'https://live.staticflickr.com/7652/27876992670_43d3fc224f_m.jpg',
    },
    title: 'Toronto Pride 2016',
}
const rawData12 = {
    link: 'https://www.flickr.com/photos/ming-zoo/28123944916/',
    media: {
        origin: 'https://live.staticflickr.com/7639/28123944916_279eeb2fd6.jpg',
        s: 'https://live.staticflickr.com/7639/28123944916_279eeb2fd6_s.jpg',
        t: 'https://live.staticflickr.com/7639/28123944916_279eeb2fd6_t.jpg',
        b: 'https://live.staticflickr.com/7639/28123944916_279eeb2fd6_b.jpg',
        m: 'https://live.staticflickr.com/7639/28123944916_279eeb2fd6_m.jpg',
    },
    title: 'Toronto Pride 2016',
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
    rawData10,
    rawData11,
    rawData12,
]

export const response = [
    new Flickr(rawData01),
    new Flickr(rawData02),
    new Flickr(rawData03),
    new Flickr(rawData04),
    new Flickr(rawData05),
    new Flickr(rawData06),
    new Flickr(rawData07),
    new Flickr(rawData08),
    new Flickr(rawData09),
    new Flickr(rawData10),
    new Flickr(rawData11),
    new Flickr(rawData12),
]
