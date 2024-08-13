const arm64 = require('./initialize-models-mac-arm64')
const nvidia = require('./initialize-models-nvidia')
const default = require('./initialize-models-default')
module.exports = async (kernel, info) => {
  let run = [
    // Edit this step to customize the git repository to use
    {
      method: "shell.run",
      params: {
        message: [
          "git clone https://github.com/comfyanonymous/ComfyUI app",
          "conda install -y conda-forge::huggingface_hub",
        ]
      }
    },
    {
      "method": "shell.run",
      "params": {
        "message": [
          "git clone https://github.com/ltdrdata/ComfyUI-Manager",
        ],
        "path": "app/custom_nodes"
      }
    },
    {
      "when": "{{gpu === 'nvidia'}}",
      "method": "shell.run",
      "params": {
        "message": [
          "git clone https://github.com/comfyanonymous/ComfyUI_bitsandbytes_NF4.git"
        ],
        "path": "app/custom_nodes"
      }
    },
    // Delete this step if your project does not use torch
    {
      method: "script.start",
      params: {
        uri: "torch.js",
        params: {
          venv: "env",                // Edit this to customize the venv folder path
          path: "app",                // Edit this to customize the path to start the shell from
          // xformers: true   // uncomment this line if your project requires xformers
        }
      }
    },
    // Edit this step with your custom install commands
    {
      method: "shell.run",
      params: {
        venv: "env",                // Edit this to customize the venv folder path
        path: "app",                // Edit this to customize the path to start the shell from
        message: [
          "pip install -r requirements.txt",
          "pip install -U bitsandbytes"
        ]
      }
    },
    {
      "method": "fs.link",
      "params": {
        "drive": {
          "checkpoints": "app/models/checkpoints",
          "clip": "app/models/clip",
          "clip_vision": "app/models/clip_vision",
          "configs": "app/models/configs",
          "controlnet": "app/models/controlnet",
          "embeddings": "app/models/embeddings",
          "loras": "app/models/loras",
          "upscale_models": "app/models/upscale_models",
          "vae": "app/models/vae"
        },
        "peers": [
          "https://github.com/cocktailpeanutlabs/automatic1111.git",
          "https://github.com/cocktailpeanutlabs/fooocus.git",
          "https://github.com/pinokiofactory/stable-diffusion-webui-forge.git"
        ]
      }
    },
    {
      "method": "fs.link",
      "params": {
        "drive": {
          "output": "app/output"
        }
      }
    },
  ]
  if (kernel.platform === 'darwin' && kernel.arch === "arm64") {
    run = run.concat(amd64.run)
  } else if (kernel.platform === 'darwin' && kernel.arch === "x64") {
    run = run.concat(amd64.run)
    //run = run.concat(default.run)
  } else if (kernel.gpu === 'nvidia') {
    run = run.concat(nvidia.run)
  } else {
    run = run.concat(default.run)
  }
  return { run }
}
