# Hermes Skill Factory 内容分析

## 原始内容

**来源**: GitHub - Romanescu11/hermes-skill-factory
**链接**: https://github.com/Romanescu11/hermes-skill-factory

## 项目描述

Meta-skill 插件，Agent 跑完任务自动生成新 skill。

翻译一下就是"Hermes 自己给自己造武器"。

## 核心功能

1. **观察工作流** - 监视用户的工作流程
2. **检测模式** - 发现可复用的工作模式
3. **自动生成** - 生成 SKILL.md 和 plugin.py
4. **直接可用** - 一键保存为可复用 skill

## 工作原理

1. SKILL.md 教 Hermes 如何观察、检测和提议 skill
2. skill_factory.py 提供命令和文件生成
3. 用户正常工作，Skill Factory 在后台监视
4. 在合适的时机提议生成新 skill

## 地址

- GitHub：https://github.com/Romanescu11/hermes-skill-factory
