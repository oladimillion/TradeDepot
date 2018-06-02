import React from "react";

const MsgInfo = (props) => {
  return (
    <div className={props.info.success ? 'msg-info clean' : 'msg-info error'}>
      <div className="message">{props.info.message.join(", ")}</div>
    </div>
  )
}

export default MsgInfo;
