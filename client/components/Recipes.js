import React from 'react'
import {connect} from 'react-redux'
import {EDA_KEY, EDA_ID} from '../../secrets'
import {RecipeSearchClient} from 'edamam-api'

export class Recipes extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ingredient: '',
      recipes: []
    }
    this.getRecipes = this.getRecipes.bind(this)
    this.selectChange = this.selectChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  async getRecipes(search) {
    try {
      const client = new RecipeSearchClient({
        appId: EDA_ID,
        appKey: EDA_KEY
      })
      const results = await client.search({query: search})
      this.setState({recipes: [results]})
    } catch (error) {
      console.log(`Error getting Recipes for ${search}`, error)
    }
  }

  selectChange(event) {
    console.log('ingredient picked', event.target.value)
    this.setState({ingredient: event.target.value})
  }

  handleSubmit(event) {
    event.preventDefault()
    console.log('Submit Recipe Clicked')
    this.getRecipes(this.state.ingredient)
  }

  render() {
    if (!this.props.predictions) {
      return <h2>Loading...</h2>
    }
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <h3>Recipes For Entry #{this.props.entry}</h3>
          <select onChange={this.selectChange}>
            <option value="-">---</option>
            {this.props.predictions.map(pdt => {
              return (
                <option key={pdt.id} value={pdt.name}>
                  {pdt.name}
                </option>
              )
            })}
          </select>
          <button type="submit">Find Recipe</button>
        </form>
        <div className="entryRecipes">
          {this.state.ingredient === 'ramen' &&
            this.state.recipes.length > 0 && (
              <div className="oneRecipe">
                <h3>Iggy's New Recipe</h3>
                <img src="/Shenanigans/IggyNewRecipe.gif" />
                <hr />
                <a href="https://finalfantasy.fandom.com/wiki/Recipe_%28Final_Fantasy_XV%29">
                  Link to Recipe
                </a>
                <div>Total Cook time: 15 minutes</div>
                <div>Calories: 15</div>
              </div>
            )}

          {this.state.recipes.length > 0 ? (
            this.state.recipes[0].hits.map((rp, index) => {
              // console.log('RECIPE', rp.recipe)
              const recipe = rp.recipe
              return (
                <div key={`id_${index}`} className="oneRecipe">
                  <h3>{recipe.label}</h3>
                  <img src={recipe.image} />
                  <a href={recipe.url}>Link to Recipe</a>
                  <br />
                  <div>Total Cook time: {recipe.totalTime} minutes</div>
                  <div>Calories: {recipe.calories}</div>
                  <hr />
                </div>
              )
            })
          ) : (
            <div>Choose one</div>
          )}
        </div>
      </div>
    )
  }
}

export default connect()(Recipes)
