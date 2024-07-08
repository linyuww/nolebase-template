vptr和tbl，typedef

动态绑定

函数指针

```cpp
#include <iostream>
using namespace std;
class base{
    int a;
    public:
    base(int x):a(x){}
    base(){}
    ~base(){}

    virtual void print(){cout << "base print" << endl;}
};

class derived: public base{
    public:
    derived(int x):base(x){}
    ~derived(){}
    virtual void print(){cout << "derived print" << endl;}
};
int main(void)
{
    derived d(1);

    base* p = new base(1); 
    p->print();

    base c ;
    typedef void (*Fun)(void);
    Fun pFun = NULL;

    cout << "虚函数表地址" << (int*)(&c) << endl;   
    // 其实就是虚指针vbtr的值,因为vbtr的地址和对象的地址相同

    cout << "虚函数表: 第一个函数地址" << (int*)*(int*)(&c) << endl;

    pFun = (Fun)*((int*)*(int*)(&c));
    pFun();

return 0;
}
```

```cpp
Fun pFun = NULL;：这里，pFun是一个Fun类型的指针，也就是一个函数指针。它被初始化为NULL，表示它不指向任何函数。

pFun = (Fun)*((int*)*(int*)(&c));：这里，pFun被赋值为c对象的虚函数表中的第一个函数的地址。这行代码首先获取c的地址&c，然后将其转换为int*类型，解引用得到虚函数表的地址，再次将其转换为int*类型，解引用得到第一个虚函数的地址，最后将其转换为Fun类型。
```

`   typedef `

[C/C++ typedef用法详解（真的很详细）-CSDN博客](https://blog.csdn.net/Andrewniu/article/details/80566324)

```c
type (*)(....)函数指针 
type (*)[]数组指针
```

```c
理解复杂声明可用的“右左法则”：
从变量名看起，先往右，再往左，碰到一个圆括号就调转阅读的方向；括号内分析完就跳出括号，还是按先右后左的顺序，如此循环，直到整个声明分析完。举例：
int (*func)(int *p);
首 先找到变量名func，外面有一对圆括号，而且左边是一个*号，这说明func是一个指针；然后跳出这个圆括号，先看右边，又遇到圆括号，这说明 (*func)是一个函数，所以func是一个指向这类函数的指针，即函数指针，这类函数具有int*类型的形参，返回值类型是int。
int (*func[5])(int *);
func 右边是一个[]运算符，说明func是具有5个元素的数组；func的左边有一个*，说明func的元素是指针（注意这里的*不是修饰func，而是修饰 func[5]的，原因是[]运算符优先级比*高，func先跟[]结合）。跳出这个括号，看右边，又遇到圆括号，说明func数组的元素是函数类型的指 针，它指向的函数具有int*类型的形参，返回值类型为int。
```

```cpp
1. 原声明：int *(*a[5])(int, char*);
变量名为a，直接用一个新别名pFun替换a就可以了：
typedef int *(*pFun)(int, char*); 
原声明的最简化版：
pFun a[5];

2. 原声明：void (*b[10]) (void (*)());
变量名为b，先替换右边部分括号里的，pFunParam为别名一：
typedef void (*pFunParam)();
再替换左边的变量b，pFunx为别名二：
typedef void (*pFunx)(pFunParam);
原声明的最简化版：
pFunx b[10];

3. 原声明：doube(*)() (*e)[9]; 
变量名为e，先替换左边部分，pFuny为别名一：
typedef double(*pFuny)();
再替换右边的变量e，pFunParamy为别名二
typedef pFuny (*pFunParamy)[9];
原声明的最简化版：
pFunParamy e;
```

