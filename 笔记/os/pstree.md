1.解析参数

2.创建根节点

3.遍历进程文件建树，用read_proc_info读取父进程，创建节点

```c
char name[100] = "\0"; 
            pid_t p = 0; 
            pid_t pp = 0; 
            getPPid(stat_detail, &p, name, &pp);

            ProcessNode* node = creatnode(name, p, pp);
            ProcessNode* proc = process_table[pp];

            
            if(pp == 0)continue;//加上这一段就只能打印init

            proc -> children[proc -> childrencount++] = node;
```

本意是想取掉一个多余的0号进程，不打印



调试发现是出现了段错误，把print_tree改成打印table[0]就可以了

具体错误有待查询





打印节点

加前缀

```bash
init(Ubuntu-22.
      ├──── init
      ├──── SessionLeader
      │     └──── Relay(17)
      │           ├──── zsh
      │           │     └──── pstree-64
      │           ├──── zsh
      │           │     └──── gitstatusd-linu
      │           ├──── zsh
      │           └──── zsh
      └──── SessionLeader
```

分三种情况

1.没有父进程，不加前缀

2.有父进程，但没有兄弟进程或者是兄弟进程中的最后一个`└──── `

3.有父进程，有兄弟进程，且不是最后一个`├────`

根据深度，加`|`或者空格



可以选择打印传入参数的子进程

修改printf函数之后就可以了

```c
void print_tree(ProcessNode* node, int level,char* prefix) {
    if (node -> childrencount == 0) return;

    for(int i = 0;i < node -> childrencount;i++)
    {   
        
        printf("%s", prefix);//打印前缀
        assert(node -> children[i] != NULL);
         //printf("%s(%d)\n", node->children[i] -> name,node->children[i] -> pid);
        if (level > 0) //如果不是根节点，若是最后一个孩子，则打印└────，否则打印├────
            printf(node -> childrencount == (i + 1) ? "└──── " : "├──── ");
   
        //参数为true时，打印pid
        if (showpid == 1) 
        {
            printf("%s(%d)\n", node->children[i] -> name,node->children[i] -> pid);
        } 
        else 
        {
            printf("%s\n", node->children[i] -> name);
        }

        char new_prefix[MAX_SIZE];
        strncpy(new_prefix, prefix, sizeof(new_prefix) - 1);
        if (level > 0)//如果不是根节点，若是最后一个孩子，则前缀加空格，否则加竖线 
        {
            strcat(new_prefix, node->childrencount == (i + 1) ? "      " : "│     ");
        }

        print_tree(node->children[i], level + 1, new_prefix);//递归打印孩子的孩子节点
    }
 
}
```

