import { romanize } from '@common/utils/number'
import { Atom } from '@src/types/atom'
import { Error as CustomError, isCustomError } from '@common/model/Error'
import { WEEK_IN_SECONDS } from '@common/constants/datetime'

export const request = async (atom: Atom, ion: number) => {
    new CustomError(`Request NIST -- atom:${atom.number}, ion:${ion}`, {
        level: 'log',
    })
    const ionRoman = romanize(ion)
    const nistUrl = `https://physics.nist.gov/cgi-bin/ASD/lines1.pl?spectra=${atom.symbol}+${ionRoman}&limits_type=0&low_w=&upp_w=&unit=1&de=0&I_scale_type=1&format=2&line_out=0&remove_js=on&en_unit=1&output=0&bibrefs=1&page_size=15&show_obs_wl=1&show_calc_wl=1&unc_out=1&order_out=0&max_low_enrg=&show_av=2&max_upp_enrg=&tsb_value=0&min_str=&A_out=0&intens_out=on&max_str=&allowed_out=1&forbid_out=1&min_accur=&min_intens=&conf_out=on&term_out=on&enrg_out=on&J_out=on&submit=Retrieve+Data`

    return await fetch(nistUrl, {
        method: 'GET',
        cache: 'force-cache',
        next: { revalidate: WEEK_IN_SECONDS },
    })
        .then((response) => {
            if (response.status >= 400) {
                throw new CustomError(
                    `Failed to request NIST -- atom:${atom.number}, ion:${ion}`,
                )
            }
            return response.text()
        })
        .catch((e: Error) => {
            if (isCustomError(e)) {
                e.echo('log')
            }
            if (e instanceof Error) {
                new CustomError(e.message, { level: 'log' })
            }
            throw e
        })
}
