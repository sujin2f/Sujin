/* Components */
import { Banner } from '@app/@banner/_components'
/* CONSTANTS */
import { MENU_NAMES } from '@lib/constants'

export default async function RecipeDetailLayout() {
    return <Banner menu={MENU_NAMES.RECIPE_USER} title="My Recipes" prefix="recipe" />
}
