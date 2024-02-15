import React from 'react';
import { Button} from 'reactstrap';

class Keys extends React.Component
{
    keypad = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

    handleClick=(e)=>
    {
        this.props.callback(e.target.innerText);
    }

    ButtonRow( start,  end)
    {
        let result = [];
        for (var i=start; i<=end;i++)
        {
            result.push(<Button className='m-1' key={i} onClick={this.handleClick}>{this.keypad[i]}</Button>)
        }
        return result;
    }

    render()
    {
        return(
            <div className='centered border3 rounded' style={{width:200}}>
            <div>
                {this.ButtonRow(0,3)}
            </div>
            <div>
                {this.ButtonRow(4,7)}
            </div>
            </div>
        )
    }
}

export default Keys;