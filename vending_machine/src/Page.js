import React from 'react';
import { 
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button,
  Container,
  Label,
  Row, 
  Col, 
  Card, 
  CardBody, 
  CardTitle, 
  CardText,
  Alert,
  FormGroup
} from 'reactstrap';

import "./vend.css"

import Keys from './Keys';

 
class Page extends React.Component
{

    constructor(props)
    {
      super(props);
        this.state = {list: [],
          modal: false,
          name: '',
          quantity: '',
          price: '',
          description: '',
          error: '',
          selectedButton: '',
        }
    }

    toggle = () => {
      this.setState({
        modal: !this.state.modal,
        name: '',
        quantity: '',
        price: '',
        error: '',
        selectedButton: '',
      });
    };

    handleNameChange = (event)=> {
      this.setState({ name: event.target.value });
    };
  
    handleQuantityChange = (event) => {
      this.setState({ quantity: event.target.value });
    };
  
    handlePriceChange = (event) => {
      this.setState({ price: event.target.value });
    };

    handleSubmit = () => {
      const { name, quantity, price, selectedButton } = this.state;
      if (!name || !quantity || !price || !selectedButton) {
        this.setState({ error: 'Please provide correct values, or cancel' });
        return;
      }
      const newItem = {
        name,
        quantity: parseInt(quantity),
        price: parseFloat(price),
        button_label: selectedButton,
      };
      fetch('http://localhost:5000/vend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      })
        .then((response) => {
          if (response.ok) {
            this.fetchData();
            this.toggle();
          } else {
            alert('Error adding item!');
          }
        })
        .catch((error) => {
          console.error('Error adding item:', error);
          alert('Error adding item!');
        });
    };

    buttonSelect=(key)=>
    {
        fetch('http://localhost:5000/vend', {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
            button_label: key
            })
        })
        .then(response => {
            if (response.ok) {
            this.fetchData(); 
            } else {
            alert('Error vending item!');
            }
        })
        .catch(error => {
            console.error('Error vending item:', error);
            alert('Error vending item!');
        });  
    }

    updateData=(data)=>
    {
        this.setState({list: data});
    }
    //This method makes the API call to retrieve the data from the server using RESTful API
    fetchData = () => {
        //With Flask CORS enabled, we can directly call the server on port 5000
        fetch('http://localhost:5000/vend')
         .then( 
             (response) => 
             {
                return response.json() ;
             }
             )//The promise response is returned, then we extract the json data
         .then (jsonOutput => //jsonOutput now has result of the data extraction
                  {
                     this.updateData(jsonOutput)
                    }
              )
      }

    //When the component is loaded, this will call the fetchData method to retrieve the data
    componentDidMount(){
        this.fetchData();
    } 
  
    render()
    {
        const listItems = this.state.list.map((item) => {
            console.log(item)
            let cardClass, textColor;
            if (item[1] >= 7) {
              cardClass = 'green';
              textColor = 'blue'
            } else if (item[1] >= 4) {
              cardClass = 'yellow';
              textColor = 'black'
            } else {
              cardClass = 'grey';
              textColor = 'white'
            }

            return (
              <Col md="3" key={item.button_label}>
                <Card style = {{width: '13rem'}} className={`mb-4 ${cardClass}`}>
                  <CardBody>

                    <CardTitle className={textColor}><strong>{item[0]}({item[1]})</strong></CardTitle>
                    <CardText className={textColor}><strong>Price: ${item[2]}</strong></CardText>
                    <CardText className={textColor}><strong>{item[3]}</strong></CardText>
                  </CardBody>
                </Card>
              </Col>
            );
          });

          const buttonOptions = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map((button) => (
            <option key={button} value={button}>
              {button}
            </option>
          ));
          
          if (this.state.list.length > 0){
            return (
              <div>
              <h3 className="flex-container centered">Mini Vend</h3>
              <Container className="left border3 rounded">
                <Row>{listItems}</Row>
              </Container>

              <Keys className="align-center" callback={this.buttonSelect} />
              <Button color="primary" onClick={this.toggle}>Add Item</Button>
              <Modal isOpen={this.state.modal} toggle={this.toggle}>
                <ModalHeader toggle={this.toggle}>Add New Item</ModalHeader>
                <ModalBody>
                  {this.state.error && <Alert color="danger">{this.state.error}</Alert>}
                  <FormGroup>
                    <Label for="name">Name</Label>
                    <Input type="text" name="name" id="name" value={this.state.name} onChange={this.handleNameChange} />
                  </FormGroup>
                  <FormGroup>
                  <Label for="quantity">Quantity</Label>
                  <Input type="number" name="quantity" id="quantity"  min="1" max="20" value={this.state.quantity} onChange={this.handleQuantityChange} />
                </FormGroup>
                <FormGroup>
                    <Label for="price">Price</Label>
                    <Input type="number" step="0.01" name="price" id="price" value={this.state.price} onChange={this.handlePriceChange} />
                </FormGroup>

                <FormGroup>
                <Label for="buttonSelect">Button</Label>
                <Input type="select" name="buttonSelect" value={this.state.selectedButton} onChange={(event) => this.setState({ selectedButton: event.target.value })}>
                  <option value="">Select a button</option>
                  {buttonOptions}
                </Input>
                </FormGroup>
                </ModalBody>

                <ModalFooter>
                  <Button color="primary" onClick={this.handleSubmit}>Add Item</Button>{' '}
                  <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                </ModalFooter>
              </Modal>
            </div> 
  );
          }
          else
            return(
                <div>
                    <Container className='centered'>
                    <h2>No data available</h2>
                    <img src='./img/ded.png' alt='dead emoji'></img>
                    <h3>Make sure the server is up and running</h3>
                    </Container>
                    <Keys callback={this.buttonSelect}></Keys>
                </div>
                    )
    }
}


{}

export default Page;
