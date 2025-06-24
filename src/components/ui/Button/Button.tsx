import "./button.css"

type ButtonProps = {
    text: string,
    className?: string,
}

export default function Button({text,className="button_submit"}:ButtonProps) {    
    return (<button className={className} type="submit">
          {text}
    </button>)
    }