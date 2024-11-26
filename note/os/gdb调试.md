gdb调试

目的：复现jyy的调试过程

直接执行`make debug`会报错，显示`no file`问题就是boot里的文件是bootblock.o而不是boot.o，所以在其Makefile里添加

```bash
cp bootblock.o boot.o
```

复制一份，如何就再次执行`make debug `就会出现新的bug

```bash
gdb.error: "/home/cgz/work/os-workbench/abstract-machine/am/src/x86/qemu/boot/boot.o": not in executable format: file format not recognized
```

显示格式不能识别，问gpt回答为该种格式不能直接调试，需要启动qemu，连接调试，事实也是这样，

问题不是这个。所以就是Makefile里缺少-ggdb

需要-ggdb提供调试信息，gdb才能调试可执行文件



在

```bash
abstract-machine/am/src/x86/qemu/boot/Makefile
```

添加-ggdb可以同时解决打印不出来的问题，不实现stdio里的printf函数也能打印



设置`$AM_HOME`为pa的框架，改写Makefile不起作用

但是改写为直接clone的

```ba
/home/cgz/work/os-workbench/abstract-machine/am/src/x86/qemu/boot/Makefile
```

就能正常使用printf，但是用make debug还是没有标记

```b
gdb.error: "/home/cgz/work/os-workbench/abstract-machine/am/src/x86/qemu/boot/boot.o": not in executable format: file format not recognized
```

造成这个的原因是在文件上没有gdb可以识别的标记

解决方法应该是加上-ggdb应该就可以

但是还是报错没有标记，把bulid生成的.o文件全部删除，再执行也一样。



尝试把py程序代码手动输入，看看能否解决

```bash
debug:
	qemu-system-i386 -s -S -machine accel=tcg -smp "1,sockets=1" \
		-drive format=raw,file=build/hello-x86-qemu &
	gdb -x debug.py
```

```python
# Register the quit hook
def on_quit():
    gdb.execute('kill')

gdb.events.exited.connect(on_quit)

# Connect to the remote target
gdb.execute('target remote localhost:1234')

# Load the debug symbols
am_home = os.environ['AM_HOME']
path = f'{am_home}/am/src/x86/qemu/boot/boot.o'
gdb.execute(f'file {path}')

# This is the 0x7c00
gdb.Breakpoint('_start')

# This is where 32-bit code starts
gdb.Breakpoint('start32')

# Continue execution
gdb.execute('continue')

```

提取出命令

```bash
qemu-system-i386 -s -S -machine accel=tcg -smp "1,sockets=1" -drive format=raw,file=build/hello-x86-qemu &
//打开虚拟机文件夹
gdb am/src/x86/qemu/boot/boot.o

target remote localhost:1234

//然后打断点执行
(gdb)b _start
(gdb)b start 32
(gdb)c

```

同样的报错



准备重新拉取框架代码测试
