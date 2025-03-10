module.exports = {
  run: [
    // nvidia 50 series
    {
      "when": "{{gpu === 'nvidia' && kernel.gpu_model && / 50.+/.test(kernel.gpu_model) }}",
      "method": "shell.run",
      "params": {
        "venv": "{{args && args.venv ? args.venv : null}}",
        "path": "{{args && args.path ? args.path : '.'}}",
        "message": [
          "uv pip install --pre torch torchvision torchaudio --index-url https://download.pytorch.org/whl/nightly/cu128"
        ]
      },
      "next": null
    },
    {
      "when": "{{gpu === 'nvidia'}}",
      "method": "shell.run",
      "params": {
        "venv": "{{args && args.venv ? args.venv : null}}",
        "path": "{{args && args.path ? args.path : '.'}}",
        "message": "pip install torch torchvision torchaudio {{args && args.xformers ? 'xformers' : ''}}  --index-url https://download.pytorch.org/whl/cu121"
      }
    },
    // windows amd
    {
      "when": "{{platform === 'win32' && gpu === 'amd'}}",
      "method": "shell.run",
      "params": {
        "venv": "{{args && args.venv ? args.venv : null}}",
        "path": "{{args && args.path ? args.path : '.'}}",
        // torch-directml
        "message": "pip install torch-directml torchaudio torchvision numpy==1.26.4"
      }
    },
    // windows cpu
    {
      "when": "{{platform === 'win32' && (gpu !== 'nvidia' && gpu !== 'amd')}}",
      "method": "shell.run",
      "params": {
        "venv": "{{args && args.venv ? args.venv : null}}",
        "path": "{{args && args.path ? args.path : '.'}}",
        "message": "pip install torch torchvision torchaudio"
      }
    },
    // arm64 mac
    {
      "when": "{{platform === 'darwin' && arch === 'arm64'}}",
      "method": "shell.run",
      "params": {
        "venv": "{{args && args.venv ? args.venv : null}}",
        "path": "{{args && args.path ? args.path : '.'}}",
        // torch nightly
        //"message": "pip install --pre torch==2.3.1 torchvision torchaudio==2.3.1 --extra-index-url https://download.pytorch.org/whl/nightly/cpu"
        "message": "pip install --pre torch==2.3.1 torchvision torchaudio==2.3.1"
      }
    },
    // intel mac
    {
      "when": "{{platform === 'darwin' && arch === 'x64'}}",
      "method": "shell.run",
      "params": {
        "venv": "{{args && args.venv ? args.venv : null}}",
        "path": "{{args && args.path ? args.path : '.'}}",
        "message": "pip install torch torchvision torchaudio numpy==1.26.4"
      }
    },
    // linux rocm (amd)
    {
      "when": "{{platform === 'linux' && gpu === 'amd'}}",
      "method": "shell.run",
      "params": {
        "venv": "{{args && args.venv ? args.venv : null}}",
        "path": "{{args && args.path ? args.path : '.'}}",
        "message": "pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/rocm6.0"
      }
    },
    // linux cpu
    {
      "when": "{{platform === 'linux' && (gpu !== 'amd' && gpu !=='nvidia')}}",
      "method": "shell.run",
      "params": {
        "venv": "{{args && args.venv ? args.venv : null}}",
        "path": "{{args && args.path ? args.path : '.'}}",
        "message": "pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu"
      }
    }
  ]
}
