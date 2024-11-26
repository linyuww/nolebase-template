hanoi



每个Frame（栈帧）都有自己的变量，pc是相互独立的，指示自身栈帧下一步要执行什么

每次call，入栈，把pc置为0，在while(1)开头再指向top

每次执行完case语句，都把pc加1，不一定是栈顶的



把递归的分解为6步，逐步执行，case3移动一个不需要保存，在case6加1就行

```c
int hanoi(int n, char from, char to, char via) {
    Frame stk[64];
    Frame *top = stk - 1;

    // Function call: push a new frame (PC=0) onto the stack
    #define call(...) ({ *(++top) = (Frame){.pc = 0, __VA_ARGS__}; })
    
    // Function return: pop the top-most frame
    #define ret(val) ({ top--; retval = (val); })


    // The last function-return's value. It is not obvious
    // that we only need one retval.
    int retval = 0;

    // The initial call to the recursive function
    call(n, from, to, via);

    while (1) {
        // Fetch the top-most frame.
        Frame *f = top;
        printf("pc=%d\n",  f->pc);
       
       
        if (top < stk) {
           // No top-most frame any more; we're done.
            break;
        }

        // Jumps may change this default next pc.
        int next_pc = f->pc + 1;
        
        // Single step execution.

        // Extract the parameters from the current frame. (It's
        // generally a bad idea to reuse variable names in
        // practice; but we did it here for readability.)
        int n = f->n, from = f->from, to = f->to, via = f->via;
        
        switch (f->pc) {
            case 0:
                if (n == 1) {
                    printf("%c -> %c\n", from, to);
                    ret(1);
                }
                break;
            case 1: call(n - 1, from, via, to); break;
            case 2: f->c1 = retval; break;
            case 3: call(1, from, to, via); break;
            case 4: call(n - 1, via, to, from); break;
            case 5: f->c2 = retval; break;
            case 6: ret(f->c1 + f->c2 + 1); break;
            default: assert(0);
        }

        f->pc = next_pc;
    }

    return retval;
}
```

