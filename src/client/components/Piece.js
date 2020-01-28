import Tail from './Tail'
import React from 'react'

// import './Piece.css'

const Piece = ({piece}) => (
    <div className="piece">
        {
            piece.map((index) => (
                piece.map((index) => (
                    <Tail
                        key={index}
                        color={ "red" }
                        other={"real"}
                    />
                ))
            ))
        }
    </div>
)

export default Piece