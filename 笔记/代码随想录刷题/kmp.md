kmp



求next数组

```cpp
for(int j = 0;j < s.szie():j++){
    while(j > 0 && s[i] != s[j])j = next[j - 1];
    if(s[i] == s[j])j++;
        next[i] = j;
}
```

生成next数组逻辑： 

1. i代表子串的最后一位，从位置1开始每轮循环右移一位；
2.  j代表最长相等前缀的后一位，因为数组下标从0开始，故j的值也能代表最长相等前后缀的长度值，每当substr【j】=substr【i】时，长度+1，即j++；
3.  如此可以知道substr【0, j-1】与substr【i-j+1, i】总是相等的
4. 所以若substr【j】!=substr【i】时，j要根据其之前确定的next【】数组值往前回溯，并不断比较substr【j】和substr【i】（因为前后缀要相等，最后一位必须要相等），以确定新的最长相等前后缀长度。

[KMP算法的前缀next数组最通俗的解释，如果看不懂我也没辙了-CSDN博客](https://blog.csdn.net/yearn520/article/details/6729426)

继承状态

如果相等就加一继承原有的对称数，如果不等就用kmp回溯到前面

j就是前后相等子串对数