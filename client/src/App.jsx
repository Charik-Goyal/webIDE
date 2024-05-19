import { useEffect, useState } from 'react'
import './App.css'
import Terminal from "./components/terminal"
import FileTree from './components/tree';
import { socket } from './socket';

function App() {

  const [fileTree, setFileTree] = useState({});

  const getFIleTree = async () => {
    const tree = await fetch('http://localhost:9000/files')
    const data = await tree.json()
    setFileTree(data.tree)
  }

  useEffect(() => {
    getFIleTree()
  },[])

  useEffect(() => {
    socket.on('file:refresh', getFIleTree)
    return () => {
      socket.off('file:refresh', getFIleTree)
    }
  },[])

  return (
    <div className="playground-container">

      <div className="editor-container">
        <div className='files'>
          <FileTree tree={fileTree} />
        </div>
        <div className='editor'>

        </div>
      </div>
      <div className="terminal-container">
        <Terminal />
      </div>
        
      

    </div>
  )
}

export default App
