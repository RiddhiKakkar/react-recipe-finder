import { useState } from "react";
import Axios from "axios";
import styled from "styled-components";
import { DialogTitle } from "@material-ui/core";
import { Dialog } from "@material-ui/core";
import { DialogContent } from "@material-ui/core";
import {DialogActions} from "@material-ui/core";
import { Header,AppIcon,AppNameComponent,SearchComponent,SearchIcon,SearchInput } from "./components/headerComponent";
import { RecipeContainer,CoverImage,RecipeName, IngredientsText, SeeMoreText } from "./components/recipeComponent"; 

const APP_ID = "11a51cfa";
const APP_KEY = "4cf8cf663ec671540b248d6358ef0e84";
const Container = styled.div`
  display:flex;
  flex-direction:column;
`;
const RecipeListContainer = styled.div`
display:flex;
flex-direction:row;
flex-wrap:wrap;
padding:30px;
justify-content:space-evenly;
gap:20px;
`;
const Placeholder = styled.img`
  width : 120px;
  height : 120px;
  margin: 200px;
  opacity: 50%;
`;
const RecipeComponent = (props) => {
  const [show, setShow] = useState(false);
  const {recipeObj} = props;
  return(
    <>
    <Dialog open = {show}>
      <DialogTitle id="alert-dialog-slide-title">Ingredients</DialogTitle>
      <DialogContent>
        <table>
          <thead>
            <th>Ingredients</th>
            <th>Weight</th>
          </thead>
          <tbody>
            {recipeObj.ingredients.map((ingredientObj) => (
              <tr>
              <td>{ingredientObj.text}</td>
              <td>{ingredientObj.weight}</td>
            </tr>
            ))}
          </tbody>
        </table>
      </DialogContent>
      <DialogActions>
        <IngredientsText onClick={() => window.open(recipeObj.url)}>See More</IngredientsText>
        <SeeMoreText onClick = {() => setShow(false)}>Close</SeeMoreText>
      </DialogActions>
    </Dialog>
    <RecipeContainer>
      <CoverImage src={recipeObj.image}/>
      <RecipeName>{recipeObj.label}</RecipeName>
      <IngredientsText onClick={() => setShow(true)}>Ingredients</IngredientsText>
      <SeeMoreText onClick={() => window.open(recipeObj.url)}>See Complete Recipe</SeeMoreText>
    </RecipeContainer>
    </>
  );
};
function App() {
  const [timeoutId, updateTimeoutId] = useState();
  const [recipeList, updateRecipeList] = useState([]);
  const fetchRecipe = async (searchString) => {
    const response = await Axios.get(`https://api.edamam.com/search?q=${searchString}&app_id=${APP_ID}&app_key=${APP_KEY}`);
    console.log(response);
    updateRecipeList(response.data.hits);
  };
  const onTextChange = (event) =>{
    clearTimeout(timeoutId);
    const timeout = setTimeout(() => fetchRecipe(event.target.value),500);
    updateTimeoutId(timeout);
  };
  return (
    <Container>
      <Header>
        <AppNameComponent>
          <AppIcon src = "hamburger.svg"/>
          Recipe Finder
        </AppNameComponent>
        <SearchComponent>
          <SearchIcon src = "/search-icon.svg"/>
          <SearchInput placeholder = "Search Recipe" onChange= {onTextChange}/>
        </SearchComponent>
      </Header>
      <RecipeListContainer>
        {recipeList.length ? recipeList.map((recipeObj) => (<RecipeComponent recipeObj={recipeObj.recipe}/>)) : (<Placeholder src="hamburger.svg"/>)}
      </RecipeListContainer>
    </Container>
  );
}

export default App;
