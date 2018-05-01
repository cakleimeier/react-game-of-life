import React, { Component } from 'react';
// Theme
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import muiTheme from './customTheme';

// Components
import AppBar from 'material-ui/AppBar';
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';
import {List, ListItem} from 'material-ui/List';

// icons
import Add from '@material-ui/icons/Add';
import Remove from '@material-ui/icons/Remove';
import PlayArrow from '@material-ui/icons/PlayArrow';
import Pause from '@material-ui/icons/Pause';
import Refresh from '@material-ui/icons/Refresh';
import Clear from '@material-ui/icons/Clear';
import Settings from '@material-ui/icons/Settings';



class Controls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  // Component Functions
    handleToggle = () => this.setState({open: !this.state.open});

    handleClose = () => this.setState({open: false});

  render() {
    // Styles
      let toolbarHeadingStyle = {
        "padding"     : "10px",
        "textAlign"   : "center"
      };

      let dividerStyle = {
        "backgroundColor" : "#00000066",
        "height"          : "1px"
      };

      let controlsStyle = {
        "justifyContent"  : "center"
      };

      let barStyle = {
        "overflow"  : "auto"
      };

      let controlBarStyle = {
        "overflow"        : "auto",
        "justifyContent"  : "center"
      }

    // Variables
      // Determine whether to use play or pause
        let playPause         = this.props.on ? <Pause /> : <PlayArrow />;
        let playPauseFunction = this.props.on ? this.props.pause : this.props.play;
      // Determine whether a speed button is disabled
        let disableSlower   = this.props.speed >= 600 ? true : false;
        let disableFaster   = this.props.speed <= 150 ? true : false;
      // Determine wheather a size button is disabled
        let disableSmaller  = this.props.size <= 30 ? true : false;
        let disableLarger   = this.props.size >= 90 ? true : false;

    return (
      <section id="controls">
        <AppBar
          title="Game of Life"
          iconElementRight={
            <FlatButton
              icon={<Settings />}
            />

          }
          showMenuIconButton={false}
          onRightIconButtonClick={this.handleToggle}
          style={barStyle}
        />

        <Drawer
          docked={false}
          width={200}
          open={this.state.open}
          onRequestChange={(open) => this.setState({open})}
          openSecondary={true}
        >
          <Toolbar
            noGutter={false}
            className="drawerToolbar"
            style={controlsStyle}
          >
            <ToolbarGroup
              firstChild={true}
              lastChild={true}
            >
              <IconButton
                disabled={disableSlower}
                onClick={() => this.props.updateSpeed("slower")}
              >
                <Remove
                  hoverColor="#0288D1"
                />
              </IconButton>
              <ToolbarTitle
                text="Speed"
                style={toolbarHeadingStyle}
              />
              <IconButton
                disabled={disableFaster}
                onClick={() => this.props.updateSpeed("faster")}
              >
                <Add
                  hoverColor="#0288D1"
                />
              </IconButton>
            </ToolbarGroup>
          </Toolbar>

          <Divider 
            style={dividerStyle}
          />

          <Toolbar
            noGutter={false}
            className="drawerToolbar"
            style={controlsStyle}
          >
            <ToolbarGroup
              firstChild={true}
              lastChild={true}
            >
              <IconButton
                disabled={disableSmaller}
                onClick={() => this.props.updateSize("smaller")}
              >
                <Remove
                  hoverColor="#0288D1"
                />
              </IconButton>
              <ToolbarTitle
                text="Cells"
                style={toolbarHeadingStyle}
              />
              <IconButton
                disabled={disableLarger}
                onClick={() => this.props.updateSize("larger")}
              >
                <Add
                  hoverColor="#0288D1"
                />
              </IconButton>
            </ToolbarGroup>
          </Toolbar>

          <Divider 
            style={dividerStyle}
          />

          <List>
            <ListItem
              primaryText={
                <span>Round: <span className="infoText">{this.props.round}</span></span>
              }
            />
            <ListItem
              primaryText={
                <span>Population: <span className="infoText">{this.props.population}</span></span>
              }
            />
          </List>

        </Drawer>

        <Toolbar
          noGutter={false}
          style={controlBarStyle}
        >
          <ToolbarGroup
            firstChild={true}
            lastChild={true}
          >
            <FlatButton
              icon={playPause}
              onClick={playPauseFunction}
            />
            <FlatButton
              icon={<Refresh />}
              onClick={() => this.props.newGame()}
            />
            <FlatButton
              icon={<Clear />}
              onClick={() => this.props.clear()}
            />
          </ToolbarGroup>
        </Toolbar>
      </section>
    );
  }
}

class BoardContainer extends Component {
  constructor(props) {
    super(props);

    this.state= {
      on:           false,
      round:        0,
      population:   0,
      currentBoard: [],
      ages:         [],
      intervalId:   '',
      size:         30,
      sizeClass:    'small',
      speed:        600,
    };

    // Bindings
      this.play         = this.play.bind(this);
      this.pause        = this.pause.bind(this);
      this.newGame      = this.newGame.bind(this);
      this.clear        = this.clear.bind(this);
      this.updateSpeed  = this.updateSpeed.bind(this);
      this.updateSize   = this.updateSize.bind(this);
      this.handleClick  = this.handleClick.bind(this);
      this.getColor     = this.getColor.bind(this);
  }

  // Game Functions
    pause() {
      clearInterval(this.state.intervalId);

      this.setState({
        on: false
      });
    }

    play() {
      this.pause();
      /* In a "setInterval" function,
          the term "this" will refer to the interval,
          so a closure is needed to set something to refer
          to the "play" function's context.
      */
      var self = this;
      let speed = this.state.speed;

      var play= setInterval(function(){
        let boards      = self.getNextBoard();
        let nextBoard   = boards[0];
        let nextAge     = boards[1];
        let round       = (self.state.round)+1;
        let population = 0;
        const arrSum = array =>
          array.reduce(
            (sum, num) => sum + (Array.isArray(num) ? arrSum(num) : num * 1),
            0
          );
        population = arrSum(nextBoard);

        self.setState({
          currentBoard: nextBoard,
          on: true,
          ages: nextAge,
          round: round,
          intervalId: play,
          population: population
        });
      }, speed);
    }

    clear() {
      this.pause();

      let empty=[];

      for (var i = 0; i < this.state.size; i++) {
        empty.push([]);
        for (var j = 0; j < this.state.size; j++) {
          empty[i].push(0);
        }
      }

      clearInterval(this.state.intervalId);

      this.setState({
        currentBoard: empty,
        round: 0
      }, this.play);
    }

    newGame() {
      this.pause();

      let board= [];
      let ages= []; 

      for (var i = 0; i < this.state.size; i++) {
        board.push([]);
        ages.push([]);

        for (var j = 0; j < this.state.size; j++) {
          let thisVal= Math.random() >= .75 ? 1 : 0;
          board[i].push(thisVal);
          ages[i].push(thisVal);
        }
      }

      clearInterval(this.state.intervalId);

      this.setState({
        currentBoard: board,
        ages: ages,
        round: 0
      }, this.play);
    }

    getNextBoard() {
      var arr = this.state.currentBoard;
      var nextBoard=[];
      var nextAge=[];
      var nextVal;

      for(var i=0; i<arr.length; i++) {
        // above loops through rows
        nextBoard.push([]);
        nextAge.push([]);

        for(var j=0, len= arr[i].length; j<len; j++) {
          // above loops through columns in row
          // got to insert this value at the current index into the nextTurn array
            // get neighbors, target= b2
              /*
                a1, a2, a3
                b1, b2, b3
                c1, c2, c3
              */
              const arrLen= arr.length-1;
              const rowLen= arr[i].length-1;

              const iMinus= i>0 ? i-1 : arrLen;
              const iPlus= i<arrLen ? i+1 : 0;
              const jMinus= j>0 ? j-1 : rowLen;
              const jPlus= j<rowLen ? j+1 : 0;

              var total= 0;
              total+=arr[iMinus][jMinus]; //a1
              total+=arr[iMinus][j];      //a2
              total+=arr[iMinus][jPlus];  //a3
              total+=arr[i][jMinus];      //b1
              total+=arr[i][jPlus];       //b3
              total+=arr[iPlus][jMinus];  //c1
              total+=arr[iPlus][j];       //c2
              total+=arr[iPlus][jPlus];   //c3

            // use neighbors to determine next state
              if (arr[i][j]===1) {
                // if cell is alive
                if (total < 2) {
                  // dead
                  nextVal= 0; 
                } else if (total > 3) {
                  // dead
                  nextVal = 0;
                }
                  else {
                  // alive
                  nextVal= 1;
                }
              } else {
                // if cell is dead
                if (total ===3) {
                  // alive
                  nextVal= 1;
                } else {
                  // dead
                  nextVal= 0;
                }
              }
          
            // get the age for this index
            var age= nextVal === 1 ? (this.state.ages[i][j]) + nextVal : 0;

          nextAge[i].push(age); 
          nextBoard[i].push(nextVal); 
        } // for columns in row
      } // for row in arr
      return [nextBoard, nextAge];
    }

    handleClick(cell, i, j) {
      let row     = i;
      let column  = j;
      let newVal  = cell === 0 ? 1 : 0;

      let originalBoard = this.state.currentBoard;
      originalBoard[row][column] = newVal;

      let ages = this.state.ages;
      ages[row][column] = newVal;

      this.setState({
        nextBoard: originalBoard,
        ages: ages
      });
      console.log(this.state.currentBoard[i][j]);
    }

    getColor(age) {
      let color;

      if (age > 0) {
        var newAge= age * 5;
        var r=Math.abs(52-newAge);
        var g=Math.abs(219-newAge);
        var b= Math.abs(147);
        color='rgb('+r+','+g+','+b+')';

      } else {
        color= '#424242';
      }

      return color;
    }

  // Controller Functions
    updateSpeed(val) {
      // pause game to do calculations
      this.pause();

      // get new speed value based on current speed value
      let newSpeed;
      let currentSpeed = this.state.speed;

      if (val === "slower") {
        newSpeed = currentSpeed * 2;
      } else{
        newSpeed = currentSpeed / 2;
      }

      console.log(this.state.speed);

      // update state and play at new speed
      this.setState({
        speed: newSpeed
      }, this.play);
    }

    updateSize(val) {
      // pause game to do calculations
      this.pause();

      // get new size value based on current size value
      let newSize;
      let currentSize = this.state.size;
      let sizeClass;

      if(val === "smaller") {
        newSize = currentSize - 30;
      } else {
        newSize = currentSize + 30;
      }

      console.log(newSize);

      if (newSize === 90) {
        sizeClass = "large"
      } else if (newSize === 60) {
        sizeClass = "medium"
      } else if (newSize === 30) {
        sizeClass = "small";
      }

      // update state and play with new size
      this.setState({
        size: newSize,
        sizeClass: sizeClass
      }, this.newGame);
    }

  render() {
    let buttonStyle = {
      "color" : "#fff"
    };

    return (
      <section className="App">
        <Controls
          on            = {this.state.on}
          round         = {this.state.round}
          population    = {this.state.population}
          currentBoard  = {this.state.currentBoard}
          ages          = {this.state.ages}
          intervalId    = {this.state.intervalId}
          size          = {this.state.size}
          speed         = {this.state.speed}
          play          = {this.play}
          pause         = {this.pause}
          newGame       = {this.newGame}
          clear         = {this.clear}
          updateSize    = {this.updateSize}
          updateSpeed   = {this.updateSpeed}
        />
        
        <Grid
          newGame       = {this.newGame}
          currentBoard  = {this.state.currentBoard}
          handleClick   = {this.handleClick}
          ages          = {this.state.ages}
          sizeClass     = {this.state.sizeClass}
          getColor      = {this.getColor}
        />

        <footer id="footer" className="row">
          <div className="col">
            <h3>Made by <a href="http://www.catherinekleimeier.com/" rel="noopener noreferrer"  target="_blank">Catherine Kleimeier</a></h3>
          </div>

          <div className="col" style={{textAlign: "center"}}>
            <FlatButton
              label="See on Github"
              style={buttonStyle}
              hoverColor="rgba(153,153,153,.5)"
              onClick={()=> window.open("https://github.com/cakleimeier/life", "_blank")}
            />
          </div>
        </footer>
      </section>
    );
  }
}

class Grid extends Component {
  constructor(props) {
    super(props);
  }

  render () {
    var self= this;
    var arr= this.props.currentBoard;

    return (
      <section id="board" ref={this.props.newGame} className={this.props.sizeClass}>
        {
          arr.map(function(thisArr, i) {
            var row = thisArr.map(function(cell, j) {
              return (
                <Cell 
                  key         = {j} 
                  className   = {cell === 0 ? 'dead': 'alive'}
                  handleClick = {self.props.handleClick}
                  age         = {self.props.ages[i][j]}
                  value       = {cell}
                  i           = {i}
                  j           = {j}
                  getColor    = {self.props.getColor}
                />
              )
            });

            return (
              <div 
                className = "row" 
                key       = {i}
              >
                {row}
              </div>
            )
          })
        }
      </section>
    );
  }
}

class Cell extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const cellClasses = `${this.props.className} col`;
    let cell          = this.props.value;
    let i             = this.props.i;
    let j             = this.props.j;
    let color         = this.props.className === "dead" ? "#424242" : this.props.getColor(this.props.age);
    let cellStyle     = {
      "backgroundColor" : color
    }

    return (
      <div
        className  = {cellClasses}
        onClick    = {() => this.props.handleClick(cell, i, j)}
        style      = {cellStyle}
      >
       &nbsp;
      </div>
    )
  }
}


class App extends Component {
  render() {
    return ( 
      <MuiThemeProvider muiTheme={muiTheme}>
        <BoardContainer />
      </MuiThemeProvider>
    );
  }
}

export default App;
