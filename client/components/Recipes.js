import React from 'react'
import {connect} from 'react-redux'
import {EDA_KEY, EDA_ID} from '../../secrets'
import {RecipeSearchClient} from 'edamam-api'
// const {RecipeSearchClient} = require('edamam-api')

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
      console.log(`Here's some Recipes for ${search}`, results)
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
    console.log('PROPS', this.props)
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
        <div>
          {this.state.recipes.length > 0 ? (
            this.state.recipes[0].hits.map((rp, index) => {
              console.log('RECIPE', rp.recipe)
              const recipe = rp.recipe
              return (
                <div key={`id_${index}`}>
                  <h3>{recipe.label}</h3>
                  <img src={recipe.image} />
                  <a href={recipe.url}>Link to Recipe</a>
                  <br />
                  <div>Total Cook time: {recipe.totalTime} minutes</div>
                  <div>Calories{recipe.calories}</div>
                  <hr />
                </div>
              )
            })
          ) : (
            <div>Nothing yet</div>
          )}
        </div>
      </div>
    )
  }
}

export default connect()(Recipes)
