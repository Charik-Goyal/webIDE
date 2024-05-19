

const FileTreeNode = ({fileName, Nodes}) => {
    const isDir = !!Nodes;
    console.log(isDir)
    return (
        <div style={{marginLeft: "10px"}}>
            <p className={isDir ? "" : "file-node"}>{fileName}</p>
            {Nodes && <ul>
                {Object.keys(Nodes).map((child) => {
                    return (
                        <li key={child}>
                        <FileTreeNode fileName={child} Nodes={Nodes[child]}/>
                    </li>
                    )
                })}
                </ul>}
        </div>
    )
}
const FileTree = ({tree}) => {

    return (
        <FileTreeNode fileName="/" Nodes={tree}/>
    )
}

export default FileTree